import { useCallback, useState } from "react"

import OfferService from "../services/OfferService"
import Player from "../models/Player"
import { OfferTypeEnum } from "../models/OfferTypeEnum"
import Offer from "../models/Offer"

import DataLoader from "../components/DataLoader"

import '../styles/panel-offers.scss';

interface PanelOffersProps {
    player: Player
    type: OfferTypeEnum
}

export default function PanelOffers({ type }: PanelOffersProps ) {
    const [offers, setOffers] = useState<Offer[]>([])

    const loadData = useCallback(async () => {
        const response = await OfferService.getByType(type)
        setOffers(response.data)
    }, [type])

    function formattedDate(date: string): string {
        return date.substring(0, 10)
    }

    return <section className={`panel-offers ${type === OfferTypeEnum.Buy ? 'panel-buy-offers' : 'panel-sell-offers'}`}>
        <header>
            <h2>{type === OfferTypeEnum.Buy ? 'Buy offers' : 'Sell offers'}</h2>
        </header>
        <article className="app-window">
            <DataLoader load={loadData}>
                <div className="table-container desktop-only">
                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Price per unit</th>
                                <th>Total price</th>
                                <th>Ends at</th>
                            </tr>
                        </thead>
                        <tbody>
                            { offers.map(offer => (
                                <tr key={offer.id}>
                                    <td>{offer.player.name}</td>
                                    <td>{offer.item.name}</td>
                                    <td>{offer.amount}</td>
                                    <td>{offer.unitPrice}</td>
                                    <td>{offer.amount * offer.unitPrice}</td>
                                    <td>{formattedDate(offer.expiresAt)}</td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
                <ul className="offers-list mobile-only">
                    { offers.map(offer => (
                        <li key={offer.id}>
                            <p className="title">{offer.item.name}</p>
                            <p className="sub-title">by {offer.player.name}</p>
                            <p><b>Amount:</b> <span>{offer.amount}</span></p>
                            <p><b>Price per unit:</b> <span>{offer.unitPrice}</span></p>
                            <p><b>Total price:</b> <span>{offer.amount * offer.unitPrice}</span></p>
                            <p><b>Expires at:</b> <span>{formattedDate(offer.expiresAt)}</span></p>
                        </li>
                    )) }
                </ul>
            </DataLoader>
        </article>
    </section>
}