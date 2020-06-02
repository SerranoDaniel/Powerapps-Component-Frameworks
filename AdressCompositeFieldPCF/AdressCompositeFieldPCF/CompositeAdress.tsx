import * as React from 'react';
import { TextField, Callout, Stack, Label, PrimaryButton } from 'office-ui-fabric-react';
import { truncateSync } from 'fs';

export interface IAdress {
    street: string;
    city: string;
    country: string;
    zipcode: string;
}

export interface ICompositeAdressProps extends IAdress {
    fullAdress: string;
    streetLabel: string;
    cityLabel: string;
    countryLabel: string;
    zipcodeLabel: string;
    onAdressChanged: (adress: IAdress) => void;
}

interface ICompositeAdressState extends IAdress {
    isCalloutVisible: boolean;
}

export default class CompositeAdress extends React.Component<ICompositeAdressProps, ICompositeAdressState>{

    constructor(props: ICompositeAdressProps) {
        super(props);

        this.state = {
            isCalloutVisible: false,
            street: props.street,
            city: props.city,
            country: props.country,
            zipcode: props.country,
        };
    }

    private _menuButtonElement = React.createRef<HTMLDivElement>();

    private showPopup = () => {
        this.setState({
            isCalloutVisible: true
        })
    }

    private hidePopup = () => {
        this.setState({
            isCalloutVisible: false
        });
    }

    private onAdressChanged = () => {
        const adress: IAdress = {
            street: this.state.street,
            city: this.state.city,
            country: this.state.country,
            zipcode: this.state.zipcode
        };

        this.props.onAdressChanged(adress);
    }

    render() {
        return (
            <div ref={this._menuButtonElement}>
                <TextField
                    value={this.props.fullAdress}
                    readOnly={true}
                    onClick={this.showPopup}
                />
                {this.state.isCalloutVisible && (
                    <Callout
                        target={this._menuButtonElement.current}
                        onDismiss={this.hidePopup}
                    >
                        <Stack horizontal>
                            <Stack tokens={{ childrenGap: 14, padding: 10 }}>
                                <Label>{this.props.streetLabel}</Label>
                                <Label>{this.props.cityLabel}</Label>
                                <Label>{this.props.countryLabel}</Label>
                                <Label>{this.props.zipcodeLabel}</Label>
                            </Stack>
                            <Stack tokens={{ childrenGap: 10, padding: 10 }}>
                                <TextField
                                    value={this.state.street}
                                    placeholder={"---"}
                                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                        this.setState({
                                            street: newValue ?? ""
                                        }, this.onAdressChanged)
                                    }}
                                />
                                <TextField
                                    value={this.state.city}
                                    placeholder={"---"}
                                    list = {"ctllist"}
                                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                        this.setState({
                                            city: newValue ?? ""
                                        }, this.onAdressChanged)
                                    }}
                                />
                                <TextField
                                    value={this.state.country}
                                    placeholder={"---"}
                                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                        this.setState({
                                            country: newValue ?? ""
                                        }, this.onAdressChanged)
                                    }}
                                />
                                <TextField
                                    value={this.state.zipcode}
                                    placeholder={"---"}
                                    onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                        this.setState({
                                            zipcode: newValue ?? ""
                                        }, this.onAdressChanged)
                                    }}
                                />
                                <PrimaryButton
                                    text={"Done"}
                                    onClick={this.hidePopup}
                                />
                            </Stack>
                        </Stack>
                    </Callout>
                )}
            </div>
        );
    }
}