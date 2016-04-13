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
* **form-control-class** *( C, Type: string, Default: col-md-12)* - Same as the "formControlClass" property in "form-options".
* **form-control-label-class** *( C, Type: string, Default: col-md-12 )* - Same as the "formControlLabelClass" property in "form-options".

#### form-control
* **control-options** *( $ )* - An object to configure the control in one place.
   * **controlName** - *( Type: string, Default: _untitled{i++} )* - The key of the property in parent "ng-model". If empty, it will be named as "_untitled1", "_untitled2", and so on
   * **controlType** - *( Type: string, Default: input )* - The type of the control. It supports `static|input`.
   * **controlLabel** - *( Type: string, Default: Untitled )* - The title of the control.
   * **controlClass** - *( Type: string, Default: Inherit from parent )* - Add ability to use custom classes to current form control, This must be a string.
   * **controlLabelClass** - *( Type: string. Default: Inherit from parent )* - Add ability to use custom classes to current form control labels, This must be a string.
