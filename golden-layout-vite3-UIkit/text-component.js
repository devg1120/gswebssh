import { ComponentContainer, JsonValue } from 'golden-layout';
import { ComponentBase } from './component-base';

export class TextComponent extends ComponentBase {
    static undefinedTextValue = '<undefined>';
    static typeName = 'text';

    _inputElement ;

    _containerClickListener = () => this.handleClickFocusEvent();
    _containerFocusinListener = () => this.handleClickFocusEvent();


    constructor(container , state , virtual ) {
        super(container, virtual);

        let textValue ;
        if (state === undefined) {
            textValue = TextComponent.undefinedTextValue;
        } else {
            if (!JsonValue.isJson(state)) {
                textValue = '<Unexpect type>';
            } else {
                const textState  = state ;
                textValue = textState.text;
            }
        }

        this._inputElement = document.createElement('input');
        this._inputElement.type = "text";
        this._inputElement.value = textValue;
        this._inputElement.style.display = "block";
        this.rootHtmlElement.appendChild(this._inputElement);

        this.container.stateRequestEvent = () => this.handleContainerStateRequestEvent();

        this.rootHtmlElement.addEventListener('click', this._containerClickListener);
        this.rootHtmlElement.addEventListener('focusin', this._containerFocusinListener);
    }

    handleContainerStateRequestEvent()  {
        const text = this._inputElement.value;
        if (text === TextComponent.undefinedTextValue) {
            return undefined;
        } else {
            return {
                text
            }
        }
    }

    handleClickFocusEvent()  {
        this.container.focus();
    }
}

/*
export namespace TextComponent {
    type TextPropertyName = 'text';
    export type State = { [propertyName in TextPropertyName]  }
}
*/
