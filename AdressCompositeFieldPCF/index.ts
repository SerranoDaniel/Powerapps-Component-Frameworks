import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CompositeAdress, { IAdress, ICompositeAdressProps } from "./CompositeAdress";

export class AdressCompositeFieldPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private container: HTMLDivElement;
	private currentAdress: IAdress;
	private notifyOutputChanged: () => void;

	private datalistElement: HTMLDataListElement;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.container = container;
		this.notifyOutputChanged = notifyOutputChanged;
		this.renderControl(context);

		var optionsHTML = "";
		var optionsHTMLarr = new Array();
		context.webAPI.retrieveMultipleRecords("cap_country", "?$select=cap_name").then(
			function success(result) {
				for (var i = 0; i < result.entities.length; i++) {
					console.log(result.entities[i].cap_name);
					optionsHTMLarr.push('<option value="');
					optionsHTMLarr.push(""+result.entities[i].cap_name);
					optionsHTMLarr.push('" />');
				}
				// perform additional operations on retrieved records
				optionsHTML = optionsHTMLarr.join("");
				console.log(optionsHTML);
			},
			function (error) {
				console.log(error.message);
				// handle error conditions
			}
		);

		this.datalistElement = document.createElement("datalist");
		this.datalistElement.setAttribute("id", "ctllist");

		//@ts-ignore 
		this.datalistElement.innerHTML = optionsHTML;


		this.container.appendChild(this.datalistElement);

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.renderControl(context);
	}

	private getFullAdress(street: string, city: string, country: string, zipcode: string): string {
		let adressArray = [];

		if (street && street != "") {
			adressArray.push(street);
		}

		if (city && city != "") {
			adressArray.push(city);
		}

		if (country && country != "") {
			adressArray.push(country);
		}

		if (zipcode && zipcode != "") {
			adressArray.push(zipcode);
		}

		return adressArray.join(" ");
	}

	private renderControl(context: ComponentFramework.Context<IInputs>): void {
		const fullAdress = this.getFullAdress(context.parameters.street.raw ?? "",
			context.parameters.city.raw ?? "",
			context.parameters.country.raw ?? "",
			context.parameters.zipcode.raw ?? "");

		const compositeControlProps: ICompositeAdressProps = {
			fullAdress: fullAdress,
			street: context.parameters.street.raw ?? "",
			streetLabel: context.parameters.street.attributes?.DisplayName!,
			city: context.parameters.city.raw ?? "",
			cityLabel: context.parameters.city.attributes?.DisplayName!,
			country: context.parameters.country.raw ?? "",
			countryLabel: context.parameters.country.attributes?.DisplayName!,
			zipcode: context.parameters.zipcode.raw ?? "",
			zipcodeLabel: context.parameters.zipcode.attributes?.DisplayName!,
			onAdressChanged: (adress: IAdress) => {
				this.currentAdress = adress,
					this.notifyOutputChanged();

			}
		};

		ReactDOM.render(React.createElement(CompositeAdress, compositeControlProps), this.container)
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			street: this.currentAdress.street,
			city: this.currentAdress.city,
			country: this.currentAdress.country,
			zipcode: this.currentAdress.zipcode,
			fulladress: this.getFullAdress(this.currentAdress.street, this.currentAdress.city, this.currentAdress.country, this.currentAdress.zipcode)
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this.container);
	}

}