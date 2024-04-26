import { ComponentContainer, JsonValue } from 'golden-layout';
import { ComponentBase } from './component-base';

export class BooleanComponent extends ComponentBase {
    static  typeName = 'boolean';

    _inputElement ;

    _containerClickListener = () => this.handleClickFocusEvent();
    _containerFocusinListener = () => this.handleClickFocusEvent();

    constructor(container , state , virtual ) {
        super(container, virtual);

        this._inputElement = document.createElement('input');
        this._inputElement.type = "checkbox";
        this._inputElement.checked = (state ) ?? true;
        this._inputElement.style.display = "block";

        this.rootHtmlElement.appendChild(this._inputElement);

        this.container.stateRequestEvent = () => this.handleContainerStateRequestEvent();

        this.rootHtmlElement.addEventListener('click', this._containerClickListener);
        this.rootHtmlElement.addEventListener('focusin', this._containerFocusinListener);
    }

    handleContainerStateRequestEvent()  {
        return this._inputElement.checked;
    }

    handleClickFocusEvent()  {
        this.container.focus();
    }
}
