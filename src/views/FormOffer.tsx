import { FormProvider, useForm } from 'react-hook-form'
import { useCallback, useEffect, useMemo, useState } from 'react';

import Player from '../models/Player';
import Item from '../models/Item';
import { OfferTypeEnum, offerTypeArray } from '../models/OfferTypeEnum';
import ItemService from '../services/ItemService';

import FormInput from '../components/FormInput';
import { SelectProps } from '../components/Select';
import LoadingOverlay from '../components/LoadingOverlay';
import OfferService from '../services/OfferService';
import { OfferInsert } from '../models/OfferInsert';
import DataLoader from '../components/DataLoader';

interface FormOfferProps {
    player: Player;
    onCancel(): void;
    onComplete(): void;
}

interface OfferForm {
    totalPrice: number;
    item: number;
    unitPrice: number;
    amount: number;
    expiresAt: Date;
    type: OfferTypeEnum;
}

const maxNumber = 1000000000 // Max value to prevent out of range exception

export default function FormOffer({ player, onCancel, onComplete }: FormOfferProps) {
    const methods = useForm<OfferForm>({mode: 'onTouched'})
    const [selectedItem, selectedType, selectedAmount, selectedUnitPrice] = methods.watch(['item', 'type', 'amount', 'unitPrice'])
    const [processing, setProcessing] = useState<boolean>(false)
    const [items, setItems] = useState<Item[]>([])
    const [playerItems, setPlayerItems] = useState<Item[]>([])
    const [submitError, setSubmitError] = useState<boolean>(false)

    // Trigger amount validation, as it's valid state depends on offer type and selected item
    useEffect(() => {
        if (selectedItem && selectedType && methods.getFieldState('amount').isTouched) methods.trigger('amount')
    }, [selectedItem, selectedType, methods])

    // Sets max amount to be selected, based on offer type and amounts in player's inventory
    const maxItemAmount = useMemo<number>((): number => {
        if (selectedType === OfferTypeEnum.Buy) {
            return maxNumber
        } else if (selectedItem) {
            return playerItems.find(el => el.id === selectedItem)?.amount || 0
        }
        return 0
    }, [selectedItem, selectedType, playerItems])

    const amountValidationMessage = selectedType === OfferTypeEnum.Sell ? 'The amount must not exceed the amount you have' : 'Amount can\'t be bigger than 1 billion'
    const totalPriceValidationMessage = selectedType === OfferTypeEnum.Buy ? 'The total price must not exceed your current gold' : 'Total price can\'t be bigger than 1 billion'

    const currentDate = () => {
        let yourDate = new Date()
        const offset = yourDate.getTimezoneOffset()
        yourDate = new Date(yourDate.getTime() - (offset*60*1000))
        return yourDate.toISOString().split('T')[0]
    }

    useEffect(() => {
        methods.setValue('totalPrice', selectedAmount * selectedUnitPrice, { shouldValidate: (!!selectedAmount && !!selectedUnitPrice) })
        // selectedAmount && selectedUnitPrice && methods.trigger('totalPrice')
    }, [selectedAmount, selectedUnitPrice, methods])

    const itemSelectProps: SelectProps<Item> = {
        trackBy: 'id',
        label: 'name',
        options: selectedType === OfferTypeEnum.Buy ? items : playerItems // Uses player inventory on sell and all items on buy
    }

    function onSubmit(data: OfferForm) {
        setProcessing(true)
        setSubmitError(false)

        OfferService.create({...data, player: player.id, totalPrice: undefined } as OfferInsert).then(response => {
            onComplete()
        }).catch(error => {
            setSubmitError(true)
        }).finally(() => setProcessing(false))
    }

    const loadData = useCallback(async () => {
        return Promise.all([
            ItemService.getByPlayerId(player.id).then(response => {
                setPlayerItems(response.data);
            }),
            ItemService.getAll().then(response => {
                setItems(response.data);
            })
        ])
    }, [player.id])

    return <FormProvider {...methods}>
        <DataLoader load={loadData}>
            <form className='flex-fill' onSubmit={methods.handleSubmit(onSubmit)}>
                <FormInput<OfferForm> id='form-offer-type' label='Offer Type' type='radio' field='type' 
                    validation={{required: true}} options={offerTypeArray}
                />
                <FormInput<OfferForm> id='form-offer-item' label='Item' type='select' field='item' placeholder='Type to search an item' 
                    validation={{required: true}} selectProps={itemSelectProps}
                />
                <FormInput<OfferForm> id='form-offer-amount' label='Amount' type='integer' field='amount' disabled={selectedType !== OfferTypeEnum.Buy && !selectedItem}
                    min={0} max={maxItemAmount} validation={{required: true, min: 0, max: { value: maxItemAmount, message: amountValidationMessage } }}
                />
                <FormInput<OfferForm> id='form-offer-unit-price' label='Price per unit' type='integer' field='unitPrice'
                    min={0} max={2147483647} validation={{required: true, min: 0, max: { value: maxNumber, message: 'Price can\'t be bigger than 1 billion' } }}
                />
                <FormInput<OfferForm> id='form-offer-total-price' label='Total price' type='number' field='totalPrice' readOnly
                    validation={{required: 'This field is filled automatically', min: 0, max: { value: selectedType === OfferTypeEnum.Buy ? player.gold : maxNumber, message: totalPriceValidationMessage } }}
                />
                <FormInput<OfferForm> id='form-offer-expires-at' label='Ends at' type='date' field='expiresAt'
                    validation={{required: true, validate: { minDate: (date) => date > currentDate() || 'End date must be in the future' }}}
                />
                { submitError && <div className="panel danger mt-4">An error occurred. Please, try again.</div>}
                <div className="flex-row gap-4 mt-4 pt-4">
                    <button type='button' className='danger flex-1' onClick={onCancel}>Cancel</button>
                    <button type='submit' className='success flex-1'>Create offer</button>
                </div>
            </form>
        </DataLoader>
        <LoadingOverlay show={processing}/>
    </FormProvider>
}