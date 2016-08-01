### Angular Form With Validation

# Document

#### form-area
* **ng-model** *( Watch, $ )* - Model where we set the form model. All form fields in this model. 
* **template-url** *( C, Default: fwv/template/form/area.html )* - Override the template for the component with a custom provided template.
* **form-options** *( $ )* - An object to configure the form in one place.
    * **disableValidation** *( C, Type: boolean, Default: false )* - Whether the form validate disable or not.
    * **formValidation** - An object to save the form validation in one place.
    * **formControls** *( Type: Array, Default: [] )* - An array of objects defining options for each form controls.
    * **formControlDisabled** *( C Watch, Type: boolean, Default: false )* - Add ability to set child controls disabled.
    * **formControlReadonly** *( C Watch, Type: boolean, Default: false )* - Add ability to set child controls readonly.
    * **formControlClass** *( C, Type: string, Default: col-md-12)* - Add ability to use custom classes for each form controls in global, This must be a string.
    * **formControlLabelClass** *( C, Type: string, Default: col-md-12 )* - Add ability to use custom classes for each form control labels in global, This must be a string.
* **disable-validation** *( $ C, Type: bool, Default: false )* - Same as the "disableValidation" property in "form-options".
* **form-control-disabled** *( $ C Watch, Type: bool, Default: false )* - Same as the "formControlDisabled" property in "form-options".
* **form-control-readonly** *( $ C Watch, Type: bool, Default: false )* - Same as the "formControlReadonly" property in "form-options".
* **form-control-class** *( C, Type: string, Default: col-md-12)* - Same as the "formControlClass" property in "form-options".
* **form-control-label-class** *( C, Type: string, Default: col-md-12 )* - Same as the "formControlLabelClass" property in "form-options".

#### form-control
* **control-options** *( $ )* - An object to configure the control in one place.
   * **controlName** - *( Type: string, Default: _untitled{i++} )* - The key of the property in parent "ng-model". If empty, it will be named as "_untitled1", "_untitled2", and so on
   * **controlType** - *( C, Type: string, Default: input )* - The type of the control. It supports `static|input|input-group|textarea|select|mutiple-select`.
   * **controlLabel** - *( C, Type: string, Default: Untitled )* - The title of the control.
   * **controlDisabled** - *( Watch Type: boolean, Default: Inherit from parent )* - Add ability to set current control disabled.
   * **controlReadonly** - *( Watch Type: boolean, Default: Inherit from parent )* - Add ability to set current control readonly.
   * **controlClass** - *( Type: string, Default: Inherit from parent )* - Add ability to use custom classes to current form control, This must be a string.
   * **controlLabelClass** - *( Type: string. Default: Inherit from parent )* - Add ability to use custom classes to current form control labels, This must be a string.
   * **controlPlaceholder** - *( Type: string, Default: null )* - Add ability to use custom placeholder text.
   * **controlGroupOptions** - *( Type: object, Default: {} )* - Extend form controls by adding text or buttons before, after, or both sides, e.g: { before: { type: 'addon', html: '$' }, after: { type: 'addon', html: '.00' } }.
   * **controlRows** - *( Type: int, Default: 4 )* - Add ability to set textarea rows.
   * **controlSelectOptions** - *( Type: object, Default: {} )* - Add ability to set select options, e.g: { options: [ { key: 'Options 1', value 1 } ], ngOptions: 'option.value*1 as option.key for option in controlSelectOptions.options' }
* **control-***** - *( Type: string, Default: _untitled(i++) )* - Same as the "control-***" property in "control-options".
