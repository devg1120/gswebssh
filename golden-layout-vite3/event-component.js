import { ComponentContainer, EventEmitter, JsonValue } from 'golden-layout';
import { ComponentBase } from './component-base';

export class EventComponent extends ComponentBase {
    static  typeName = 'event';

    _inputElement ;
    _sendElement ;

    _containerClickListener = () => this.handleClickFocusEvent();
    _containerFocusinListener = () => this.handleClickFocusEvent();

    constructor(container , state , virtual ) {
        super(container, virtual);

        this._inputElement = document.createElement('input');
        this._inputElement.type = "text";
        this._inputElement.style.display = "block";
        this.rootHtmlElement.appendChild(this._inputElement);

        this._sendElement = document.createElement('button');
        this._sendElement.innerText = "SEND EVENT";
        this._sendElement.addEventListener('click', () => {
            this.container.layoutManager.eventHub.emitUserBroadcast('foo', this._inputElement.value);
        });
        this.rootHtmlElement.appendChild(this._sendElement);

        const cb = (...ev ) => {
            const evt = document.createElement('span');
            evt.innerText = `Received: ${ev}`
            this.rootHtmlElement.appendChild(evt);
        };

        this.container.layoutManager.eventHub.on('userBroadcast', cb);
        this.container.on('beforeComponentRelease', () => {
            this.container.layoutManager.eventHub.off('userBroadcast', cb);
        })

        this.rootHtmlElement.addEventListener('click', this._containerClickListener);
        this.rootHtmlElement.addEventListener('focusin', this._containerFocusinListener);
    }

    handleClickFocusEvent()  {
        this.container.focus();
    }
}
