import {IInputs, IOutputs} from "./generated/ManifestTypes";
import IndexControl, { IIndexControlProps, IName } from "./IndexControl";
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class FullNamePopup implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private container: HTMLDivElement;
	private currentName: IName;
	private notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this.container = container;
		this.notifyOutputChanged = notifyOutputChanged;
		this.renderControl(context);

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this.renderControl(context);
	}

	private getFullname(firstName: string, middleName: string, lastName: string): string {
		let nameArray = [];

		if(firstName && firstName != ""){
			nameArray.push(firstName);
		}

		if(middleName && middleName != ""){
			nameArray.push(middleName);
		}

		if(lastName && lastName != ""){
			nameArray.push(lastName);
		}

		return nameArray.join(" ");
	}

	private renderControl(context: ComponentFramework.Context<IInputs>): void{
		const fullName = this.getFullname(context.parameters.firstname.raw ?? "",
			context.parameters.middlename.raw ?? "",
			context.parameters.lastname.raw ?? "");

			const indexControlProps: IIndexControlProps = {
				fullName: fullName,
				firstName: context.parameters.firstname.raw ?? "",
				firstNameLabel: context.parameters.firstname.attributes?.DisplayName!,
				middleName: context.parameters.middlename.raw ?? "",
				middleNameLabel: context.parameters.middlename.attributes?.DisplayName!,
				lastName: context.parameters.lastname.raw ?? "",
				lastNameLabel: context.parameters.lastname.attributes?.DisplayName!,
				onNameChanged: (name:IName) => {
					this.currentName = name,
					this.notifyOutputChanged();

				}
			};

			ReactDOM.render(React.createElement(IndexControl, indexControlProps),this.container)
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			firstname: this.currentName.firstName,
			lastname: this.currentName.lastName,
			middlename: this.currentName.middleName,
			fullname: this.getFullname(this.currentName.firstName, this.currentName.middleName, this.currentName.lastName)
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		ReactDOM.unmountComponentAtNode(this.container);
	}
}