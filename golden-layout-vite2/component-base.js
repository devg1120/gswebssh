import { ComponentContainer, GoldenLayout } from 'golden-layout';

export  class ComponentBase  {
    _rootElement ;
    _container;

    get container()  { return this._container; }
    get rootHtmlElement()  { return this._rootElement; }

    constructor( _container , virtual ) {
        this._container = _container;
        if (virtual) {
            this._rootElement = document.createElement('div');
            this._rootElement.style.position = 'absolute';
            this._rootElement.style.overflow = 'hidden';
        } else {
            this._rootElement = this._container.element;
        }
    }
}
