import { memo, useEffect, useRef, useState } from 'react';

import Player from '../models/Player';
import { OfferTypeEnum } from '../models/OfferTypeEnum';

import PlayerService from '../services/PlayerService';
import PanelItems from './PanelItems';
import PanelOffers from './PanelOffers';
import PanelFooter from './PanelFooter';

import FormOffer from './FormOffer';
import Modal, { ModalRef } from '../components/Modal';

import '../styles/view-dashboard.scss';

interface DashboardProps {
    player: Player;
    onSwitchPlayer(): void;
    onUpdatePlayer(player: Player): void;
}

export default memo(({ player, onSwitchPlayer, onUpdatePlayer }: DashboardProps) => {
    const modalRef = useRef<ModalRef>(null);
    const [stateKey, setStateKey] = useState<number>(0);

    function onCompleteCreate() {
        modalRef.current?.hide();
        setStateKey(stateKey + 1);
    }

    useEffect(() => {
        if (stateKey > 0) {
            PlayerService.getById(player.id).then(response => {
                onUpdatePlayer(response.data)
            }).catch()
        }
    }, [stateKey, onUpdatePlayer, player.id])

    return <main className="view-dashboard">
        <PanelItems player={player} key={`items-${stateKey}`}/>

        <PanelOffers player={player} type={OfferTypeEnum.Buy} key={`buy-${stateKey}`}/>

        <PanelOffers player={player} type={OfferTypeEnum.Sell} key={`sell-${stateKey}`}/>

        <PanelFooter player={player} onSwitchPlayer={onSwitchPlayer} onCreateOffer={() => modalRef.current?.show()}/>

        <Modal ref={modalRef}>
            <FormOffer player={player} onCancel={() => modalRef.current?.hide()} onComplete={onCompleteCreate}/>
        </Modal>
    </main>
})