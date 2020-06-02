/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    fulladress: ComponentFramework.PropertyTypes.StringProperty;
    street: ComponentFramework.PropertyTypes.StringProperty;
    city: ComponentFramework.PropertyTypes.StringProperty;
    country: ComponentFramework.PropertyTypes.StringProperty;
    zipcode: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    fulladress?: string;
    street?: string;
    city?: string;
    country?: string;
    zipcode?: string;
}
