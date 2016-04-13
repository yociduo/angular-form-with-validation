### Angular Form With Validation

# Document

#### form-area
* **ng-model** *( Watch, $ )* - Model where we set the form model. All form fields in this model. 
* **template-url** *( C, Default: fwv/template/form/area.html )* - Override the template for the component with a custom provided template.
* **form-options** *( $ )* - An object to configure the form in one place.
    * **disableValidation** *( C, Type: bool, Default: false )* - Whether the form validate disable or not.
    * **formValidateion** *( $ )* - An object to save the form validation in one place.
    * **formControls** *( $, Type: Array, Default: null )* - An array of objects defining options for each form controls.
    * **formControlClass** *( C, Type: string, Default: col-md-12)* - Add ability to use custom classes for each form controls in global, This must be a string.
    * **formControlLabelClass** *( C, Type: string, Default: col-md-12 )* - Add ability to use custom classes for each form control labels in global, This must be a string.
* **form-control-class** *( C, Type: string, Default: col-md-12)* - Add ability to use custom classes for each form controls in global, This must be a string.
* **form-control-label-class** *( C, Type: string, Default: col-md-12 )* - Add ability to use custom classes for each form control labels in global, This must be a string.

#### form-control
