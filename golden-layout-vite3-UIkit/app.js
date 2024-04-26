//import {GoldenLayout}  from 'golden-layout'
import  "./node_modules/golden-layout/dist/css/goldenlayout-base.css";
import  "./node_modules/golden-layout/dist/css/themes/goldenlayout-dark-theme.css";
import "./styles.css";
//import "./css/bulma.min.css";
import "./node_modules/uikit/dist/js/uikit.min.js"
import "./node_modules/uikit/dist/js/uikit-icons.min.js"
import "./node_modules/uikit/dist/css/uikit.min.css"

import { ComponentBase } from './component-base';
import {
    ComponentContainer,
    ComponentItemConfig,
    ContentItem,
    EventEmitter,
    GoldenLayout,
    JsonValue,
    LayoutConfig,
    LogicalZIndex,
    ResolvedComponentItemConfig,
    ResolvedLayoutConfig,
    Stack
} from "golden-layout";
import { BooleanComponent } from './boolean-component';
import { ColorComponent } from './color-component';
import { EventComponent } from './event-component';
import { prefinedLayouts } from './predefined-layouts';
import { TextComponent } from './text-component';

export class App {
      _layoutElement;
      _controlsElement;
      _goldenLayout;
      _registerComponentTypesButton;
      _registerComponentTypesButtonClickListener = () => this.registerComponentTypes();
      _registerAllRadio;
      _registerColorEventRadio;
      _registerComponentTypesAsVirtualButton;
      _registerComponentTypesAsVirtualButtonClickListener = () => this.registerComponentTypesAsVirtual();
      _registerAllAsVirtualRadio;
      _registerTextBooleanAsVirtualRadio;
      _registeredComponentTypesForAddSelect;
      _registeredComponentTypesForAddSelectChangeListener = () => this.handleRegisteredComponentTypesForAddSelectChange();
      _eventBindingVirtualRadio;
      _eventBindingVirtualRadioClickListener = () => this.handleEventBindingVirtualRadioClick();
      _eventBindingEmbeddedRadio;
      _eventBindingEmbeddedRadioClickListener = () => this.handleEventBindingEmbeddedRadioClick();
      _clearButton;
      _clearButtonClickListener = () => this.handleClearButtonClick();
      _addComponentButton ;
      _addComponentButtonClickListener = () => this.handleAddComponentButtonClick();
      _layoutSelect ;
      _layoutSelectChangeListener = () => this.handleLayoutSelectChange();
      _loadLayoutButton ;
      _loadLayoutButtonClickListener = () => this.handleLoadLayoutButtonClick();
      _loadComponentAsRootButton ;
      _loadComponentAsRootClickListener = () => this.handleLoadComponentAsRootButtonClick();
      _registeredComponentTypesForReplaceSelect ;
      _registeredComponentTypesForReplaceSelectChangeListener = () => this.handleRegisteredComponentTypesForReplaceSelectChange();
      _replaceComponentButton ;
      _replaceComponentButtonClickListener = () => this.handleReplaceComponentButtonClick();
      _saveLayoutButton 
      _saveLayoutButtonClickListener = () => this.handleSaveLayoutButtonClick();
      _reloadSavedLayoutButton ;
      _reloadSavedLayoutButtonClickListener = () => this.handleReloadSavedLayoutButtonClick();
      _lastVirtualRectingCountSpan ;
      _bubbleClickCountSpan ;
      _captureClickCountSpan ;
      _stackHeaderClickedDiv ;
      _stackHeaderClickedItemCountSpan ;

      _boundComponentMap = new Map();

     _bubbleClickCount = 0;
     _captureClickCount = 0;
     _lastVirtualRectingCount = 0;

     _allComponentsRegistered = false;
     _savedLayout;
     _useVirtualEventBinding = true;

     _goldenLayoutBoundingClientRect  = new DOMRect();

      _globalBubbleClickListener = () => this.handleGlobalBubbleClickEvent();
      _globalCaptureClickListener = () => this.handleGlobalCaptureClickEvent();
      _bindComponentEventListener =
        (container, itemConfig ) => this.handleBindComponentEvent(container, itemConfig);
      _unbindComponentEventListener = (container ) => this.handleUnbindComponentEvent(container);

    constructor() {
        const controlsElement = document.querySelector('#controls') ;
        if (controlsElement === null) {
            throw new Error('controlsElement not found');
        }
        this._controlsElement = controlsElement;

        const layoutElement = document.querySelector('#layoutContainer') ;
        if (layoutElement === null) {
            throw new Error('layoutContainerElement not found');
        }
        this._layoutElement = layoutElement;
        this._goldenLayout = new GoldenLayout(this._layoutElement, this._bindComponentEventListener, this._unbindComponentEventListener);

        this._goldenLayout.resizeWithContainerAutomatically = true;
        this._goldenLayout.beforeVirtualRectingEvent = (count) => this.handleBeforeVirtualRectingEvent(count);
        this._goldenLayout.addEventListener('stackHeaderClick', (event) => this.handleStackHeaderClick(event));

        const registerNotVirtualComponentTypesButton = document.querySelector('#registerNotVirtualButton') ;
        if (registerNotVirtualComponentTypesButton === null) {
            throw new Error('Could not find RegisterNotVirtualButton');
        }
        this._registerComponentTypesButton = registerNotVirtualComponentTypesButton;
        this._registerComponentTypesButton.addEventListener('click', this._registerComponentTypesButtonClickListener,
            { passive: true }
        );

        const registerNotVirtualAllRadio = document.querySelector('#registerNotVirtualAllRadio') ;
        if (registerNotVirtualAllRadio === null) {
            throw new Error('Could not find RegisterNotVirtualAllRadio');
        }
        this._registerAllRadio = registerNotVirtualAllRadio;

        const registerNotVirtualColorEventRadio = document.querySelector('#registerNotVirtualColorEventRadio') ;
        if (registerNotVirtualColorEventRadio === null) {
            throw new Error('Could not find RegisterNotVirtualColorEventRadio');
        }
        this._registerColorEventRadio = registerNotVirtualColorEventRadio;

        const registerVirtualComponentTypesButton = document.querySelector('#registerVirtualButton') ;
        if (registerVirtualComponentTypesButton === null) {
            throw new Error('Could not find RegisterVirtualButton');
        }
        this._registerComponentTypesAsVirtualButton = registerVirtualComponentTypesButton;
        this._registerComponentTypesAsVirtualButton.addEventListener('click', this._registerComponentTypesAsVirtualButtonClickListener,
            { passive: true }
        );

        const registerVirtualAllRadio = document.querySelector('#registerVirtualAllRadio') ;
        if (registerVirtualAllRadio === null) {
            throw new Error('Could not find RegisterVirtualAllRadio');
        }
        this._registerAllAsVirtualRadio = registerVirtualAllRadio;

        const registerVirtualTextBooleanRadio = document.querySelector('#registerVirtualTextBooleanRadio') ;
        if (registerVirtualTextBooleanRadio === null) {
            throw new Error('Could not find RegisterVirtualTextBooleanRadio');
        }
        this._registerTextBooleanAsVirtualRadio = registerVirtualTextBooleanRadio;

        const eventBindingVirtualRadio = document.querySelector('#eventBindingVirtualRadio') ;
        if (eventBindingVirtualRadio === null) {
            throw new Error('Could not find EventBindingVirtualRadio');
        }
        this._eventBindingVirtualRadio = eventBindingVirtualRadio;
        this._eventBindingVirtualRadio.addEventListener('click', this._eventBindingVirtualRadioClickListener, { passive: true });

        const eventBindingEmbeddedRadio = document.querySelector('#eventBindingEmbeddedRadio') ;
        if (eventBindingEmbeddedRadio === null) {
            throw new Error('Could not find EventBindingEmbeddedRadio');
        }
        this._eventBindingEmbeddedRadio = eventBindingEmbeddedRadio;
        this._eventBindingEmbeddedRadio.addEventListener('click', this._eventBindingEmbeddedRadioClickListener, { passive: true });

        this._eventBindingVirtualRadio.checked = this._useVirtualEventBinding;

        const clearButton = document.querySelector('#clearButton') ;
        if (clearButton === null) {
            throw new Error('Could not find ClearButton');
        }
        this._clearButton = clearButton;
        this._clearButton.addEventListener('click', this._clearButtonClickListener, { passive: true });

        const registeredComponentTypesForAddSelect = document.querySelector('#registeredComponentTypesForAddSelect') ;
        if (registeredComponentTypesForAddSelect === null) {
            throw new Error()
        }
        this._registeredComponentTypesForAddSelect = registeredComponentTypesForAddSelect;
        this._registeredComponentTypesForAddSelect.addEventListener('change', this._registeredComponentTypesForAddSelectChangeListener,
            { passive: true }
        );

        const addComponentButton = document.querySelector('#addComponentButton') ;
        if (addComponentButton === null) {
            throw new Error('Could not find addComponentButton');
        }
        this._addComponentButton = addComponentButton;
        this._addComponentButton.addEventListener('click', this._addComponentButtonClickListener, { passive: true });

        const addComponentByDragButton = document.querySelector('#addComponentByDragButton') ;
        if (addComponentByDragButton === null) {
            throw new Error('Could not find addComponentByDragButton');
        }
        const addComponentDragSource = this._goldenLayout.newDragSource(addComponentByDragButton, () => this.getDragComponentTypeAndState());
        if (addComponentDragSource === undefined) {
            throw new Error('addComponentDragSource undefined');
        }

        const layoutSelect = document.querySelector('#layoutSelect') ;
        if (layoutSelect === null) {
            throw new Error()
        }
        this._layoutSelect = layoutSelect;
        this._layoutSelect.addEventListener('change', this._layoutSelectChangeListener, { passive: true });

        const loadLayoutButton = document.querySelector('#loadLayoutButton') 
        if (loadLayoutButton === null) {
            throw new Error('Could not find loadLayoutButton');
        }
        this._loadLayoutButton = loadLayoutButton;
        this._loadLayoutButton.addEventListener('click', this._loadLayoutButtonClickListener, { passive: true });

        const loadComponentAsRootButton = document.querySelector('#loadComponentAsRootButton') ;
        if (loadComponentAsRootButton === null) {
            throw new Error('Could not find loadComponentAsRootButton');
        }
        this._loadComponentAsRootButton = loadComponentAsRootButton;
        this._loadComponentAsRootButton.addEventListener('click', this._loadComponentAsRootClickListener, { passive: true });

        const registeredComponentTypesForReplaceSelect = document.querySelector('#registeredComponentTypesForReplaceSelect') ;
        if (registeredComponentTypesForReplaceSelect === null) {
            throw new Error()
        }
        this._registeredComponentTypesForReplaceSelect = registeredComponentTypesForReplaceSelect;
        this._registeredComponentTypesForReplaceSelect.addEventListener('change', this._registeredComponentTypesForReplaceSelectChangeListener, { passive: true });

        const replaceComponentButton = document.querySelector('#replaceComponentButton') ;
        if (replaceComponentButton === null) {
            throw new Error('Could not find replaceComponentButton');
        }
        this._replaceComponentButton = replaceComponentButton;
        this._replaceComponentButton.addEventListener('click', this._replaceComponentButtonClickListener, { passive: true });

        const saveLayoutButton = document.querySelector('#saveLayoutButton') 
        if (saveLayoutButton === null) {
            throw new Error('Could not find saveLayoutButton');
        }
        this._saveLayoutButton = saveLayoutButton;
        this._saveLayoutButton.addEventListener('click', this._saveLayoutButtonClickListener, { passive: true });

        const reloadSavedLayoutButton = document.querySelector('#reloadSavedLayoutButton') ;
        if (reloadSavedLayoutButton === null) {
            throw new Error('Could not find reloadSavedLayoutButton');
        }
        this._reloadSavedLayoutButton = reloadSavedLayoutButton;
        this._reloadSavedLayoutButton.disabled = true;
        this._reloadSavedLayoutButton.addEventListener('click', this._reloadSavedLayoutButtonClickListener, { passive: true });

        const lastVirtualRectingCountSpan = document.querySelector('#lastVirtualRectingCountSpan') ;
        if (lastVirtualRectingCountSpan === null) {
            throw new Error('Could not find LastVirtualRectingCountSpan');
        }
        this._lastVirtualRectingCountSpan = lastVirtualRectingCountSpan;
        this._lastVirtualRectingCountSpan.innerText = this._lastVirtualRectingCount.toString();

        const bubbleClickCountSpan = document.querySelector('#bubbleClickCountSpan') ;
        if (bubbleClickCountSpan === null) {
            throw new Error('Could not find bubbleClickCountSpan');
        }
        this._bubbleClickCountSpan = bubbleClickCountSpan;
        this._bubbleClickCountSpan.innerText = this._bubbleClickCount.toString();
        const captureClickCountSpan = document.querySelector('#captureClickCountSpan') ;
        if (captureClickCountSpan === null) {
            throw new Error('Could not find captureClickCountSpan');
        }
        this._captureClickCountSpan = captureClickCountSpan;
        this._captureClickCountSpan.innerText = this._captureClickCount.toString();

        const stackHeaderClickedDiv = document.querySelector('#stackHeaderClickedDiv') ;
        if (stackHeaderClickedDiv === null) {
            throw new Error('Could not find stackHeaderClickedDiv');
        }
        this._stackHeaderClickedDiv = stackHeaderClickedDiv;
        this._stackHeaderClickedDiv.style.display = 'none';
        const stackHeaderClickedItemCountSpan = document.querySelector('#stackHeaderClickedItemCountSpan') ;
        if (stackHeaderClickedItemCountSpan === null) {
            throw new Error('Could not find stackHeaderClickedItemCountSpan');
        }
        this._stackHeaderClickedItemCountSpan = stackHeaderClickedItemCountSpan;

        if (this._goldenLayout.isSubWindow) {
            this._controlsElement.style.display = 'none';
            this._goldenLayout.checkAddDefaultPopinButton();

            const subWindowUsesRegistrationBindings = false; // change to true if you want to test sub windows with registration bindings
            if (subWindowUsesRegistrationBindings) {
                this.registerComponentTypes();
            }
        }

        globalThis.addEventListener('click', this._globalBubbleClickListener, { passive: true });
        globalThis.addEventListener('click', this._globalCaptureClickListener, { capture: true, passive: true });
    }

    start()  {
        this.loadComponentTypesForAddSelect();
        this.loadComponentTypesForReplaceSelect();
        this.loadLayoutSelect();
    }

    createComponent(container , componentTypeName , state , virtual ) {
        switch (componentTypeName) {
            case ColorComponent.typeName: return new ColorComponent(container, state, virtual);
            case TextComponent.typeName: return new TextComponent(container, state, virtual);
            case BooleanComponent.typeName: return new BooleanComponent(container, state, virtual);
            case EventComponent.typeName: return new EventComponent(container, state, virtual);
            default:
                throw new Error('createComponent: Unexpected componentTypeName: ' + componentTypeName);
        }
    }

    handleBindComponentEvent(container , itemConfig )  {
        const componentTypeName = ResolvedComponentItemConfig.resolveComponentTypeName(itemConfig);
        if (componentTypeName === undefined) {
            throw new Error('handleBindComponentEvent: Undefined componentTypeName');
        }
        const component = this.createComponent(container, componentTypeName, itemConfig.componentState, this._useVirtualEventBinding);
        this._boundComponentMap.set(container, component);

        if (this._useVirtualEventBinding) {
            const componentRootElement = component.rootHtmlElement;
            this._layoutElement.appendChild(componentRootElement);
            container.virtualRectingRequiredEvent =
                (container, width, height) => this.handleContainerVirtualRectingRequiredEvent(container, width, height);
            container.virtualVisibilityChangeRequiredEvent =
                (container, visible) => this.handleContainerVirtualVisibilityChangeRequiredEvent(container, visible);
            container.virtualZIndexChangeRequiredEvent =
                (container, logicalZIndex, defaultZIndex) =>
                    this.handleContainerVirtualZIndexChangeRequiredEvent(container, logicalZIndex, defaultZIndex);
            return {
                component,
                virtual: true,
            }
        } else {
            // Note that container.element is used as the root element in the component. This is set up in the component constructor
            return {
                component,
                virtual: false,
            }
        }
    }

    handleUnbindComponentEvent(container ) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleUnbindComponentEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleUnbindComponentEvent: Component does not have a root HTML element');
        }

        if (container.virtual) {
            this._layoutElement.removeChild(componentRootElement);
        } else {
            // If embedded, then component handles unbinding of component elements from content.element
        }
        this._boundComponentMap.delete(container);
    }

    handleBeforeVirtualRectingEvent(count ) {
        this._goldenLayoutBoundingClientRect = this._layoutElement.getBoundingClientRect();
        this._lastVirtualRectingCount = count;
        this._lastVirtualRectingCountSpan.innerText = this._lastVirtualRectingCount.toString();
    }

    handleContainerVirtualRectingRequiredEvent(container , width , height ) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVirtualRectingRequiredEvent: Component not found');
        }

        const rootElement = component.rootHtmlElement;
        if (rootElement === undefined) {
            throw new Error('handleContainerVirtualRectingRequiredEvent: Component does not have a root HTML element');
        }

        const containerBoundingClientRect = container.element.getBoundingClientRect();
        const left = containerBoundingClientRect.left - this._goldenLayoutBoundingClientRect.left;
        rootElement.style.left = this.numberToPixels(left);
        const top = containerBoundingClientRect.top - this._goldenLayoutBoundingClientRect.top;
        rootElement.style.top = this.numberToPixels(top);
        rootElement.style.width = this.numberToPixels(width);
        rootElement.style.height = this.numberToPixels(height);
    }

    handleContainerVirtualVisibilityChangeRequiredEvent(container , visible ) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVisibilityChangeRequiredEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleContainerVisibilityChangeRequiredEvent: Component does not have a root HTML element');
        }

        if (visible) {
            componentRootElement.style.display = '';
        } else {
            componentRootElement.style.display = 'none';
        }
    }

    /** @internal */
    handleContainerVirtualZIndexChangeRequiredEvent(container , logicalZIndex , defaultZIndex ) {
        const component = this._boundComponentMap.get(container);
        if (component === undefined) {
            throw new Error('handleContainerVirtualZIndexChangeRequiredEvent: Component not found');
        }

        const componentRootElement = component.rootHtmlElement;
        if (componentRootElement === undefined) {
            throw new Error('handleContainerVirtualZIndexChangeRequiredEvent: Component does not have a root HTML element');
        }

        componentRootElement.style.zIndex = defaultZIndex;
    }

    handleGlobalBubbleClickEvent() {
        this._bubbleClickCount++;
        this._bubbleClickCountSpan.innerText = this._bubbleClickCount.toString();
    }

    handleGlobalCaptureClickEvent() {
        this._captureClickCount++;
        this._captureClickCountSpan.innerText = this._captureClickCount.toString();
    }

    registerComponentTypes() {
        if (this._allComponentsRegistered) {
            return;
        }

        this._goldenLayout.registerComponentConstructor(ColorComponent.typeName, ColorComponent);
        this._goldenLayout.registerComponentConstructor(EventComponent.typeName, EventComponent);
        this._registerComponentTypesButton.disabled = true;
        this._registerAllRadio.disabled = true;
        this._registerColorEventRadio.disabled = true;
        if (this._registerAllRadio.checked) {
            this._goldenLayout.registerComponentConstructor(TextComponent.typeName, TextComponent);
            this._goldenLayout.registerComponentConstructor(BooleanComponent.typeName, BooleanComponent);
            this._allComponentsRegistered = true;
            this._registerComponentTypesAsVirtualButton.disabled = true;
            this._registerTextBooleanAsVirtualRadio.disabled = true;
        } else {
            this._registerTextBooleanAsVirtualRadio.checked = true;
        }
        this._registerAllAsVirtualRadio.disabled = true;
    }

    registerComponentTypesAsVirtual() {
        if (this._allComponentsRegistered) {
            return;
        }

        this._goldenLayout.registerComponentConstructor(TextComponent.typeName, TextComponent, true);
        this._goldenLayout.registerComponentConstructor(BooleanComponent.typeName, BooleanComponent, true);
        this._registerComponentTypesAsVirtualButton.disabled = true;
        this._registerAllAsVirtualRadio.disabled = true;
        this._registerTextBooleanAsVirtualRadio.disabled = true;
        if (this._registerAllAsVirtualRadio.checked) {
            this._goldenLayout.registerComponentConstructor(ColorComponent.typeName, ColorComponent, true);
            this._goldenLayout.registerComponentConstructor(EventComponent.typeName, EventComponent, true);
            this._allComponentsRegistered = true;
            this._registerComponentTypesButton.disabled = true;
            this._registerColorEventRadio.disabled = true;
        } else {
            this._registerColorEventRadio.checked = true;
        }
        this._registerAllRadio.disabled = true;
    }

    handleEventBindingVirtualRadioClick() {
        this._goldenLayout.clear();
        this._useVirtualEventBinding = true;
    }

    handleEventBindingEmbeddedRadioClick() {
        this._goldenLayout.clear();
        this._useVirtualEventBinding = false;
    }

    handleRegisteredComponentTypesForAddSelectChange() {
        // nothing to do here
    }

    handleLayoutSelectChange() {
        // nothing to do here
    }

    handleClearButtonClick() {
        this._goldenLayout.clear();
    }

    handleStackHeaderClick(event ) {
        const stack = event.target ;
        const itemCount = stack.contentItems.length;
        this._stackHeaderClickedItemCountSpan.innerText = itemCount.toString();
        this._stackHeaderClickedDiv.style.display = '';
        setTimeout(() => { this._stackHeaderClickedDiv.style.display = 'none'; }, 1000);
    }

    handleAddComponentButtonClick() {
        const componentType = this._registeredComponentTypesForAddSelect.value;
        this._goldenLayout.addComponent(componentType);
    }

    getDragComponentTypeAndState()  {
        const componentType = this._registeredComponentTypesForAddSelect.value;
        const itemConfig  = {
            type: 'component',
            componentType,
        }
        return itemConfig;
    }

    handleLoadLayoutButtonClick() {
        const layoutName = this._layoutSelect.value;
        const layouts = prefinedLayouts.allComponents;
        const selectedLayout = layouts.find((layout) => layout.name === layoutName);
        if (selectedLayout === undefined) {
            throw new Error('handleLayoutSelectChange');
        } else {
            this._goldenLayout.loadLayout(selectedLayout.config);
        }
    }

    handleLoadComponentAsRootButtonClick() {
        const itemConfig  = {
            type: 'component',
            componentType: ColorComponent.typeName,
            componentState: 'yellow',
        };
        this._goldenLayout.loadComponentAsRoot(itemConfig);
    }

    handleRegisteredComponentTypesForReplaceSelectChange() {
        // nothing to do here
    }

    handleReplaceComponentButtonClick() {
        const componentType = this._registeredComponentTypesForReplaceSelect.value;
        const itemConfig  = {
            componentType,
            type: 'component',
        }
        const rootItem = this._goldenLayout.rootItem;
        if (rootItem !== undefined) {
            const content = [rootItem];
            this.replaceComponentRecursively(content, itemConfig);
        }

    }

    handleSaveLayoutButtonClick() {
        this._savedLayout = this._goldenLayout.saveLayout();
        this._reloadSavedLayoutButton.disabled = false;
    }

    handleReloadSavedLayoutButtonClick() {
        if (this._savedLayout === undefined) {
            throw new Error('No saved layout');
        } else {
            const layoutConfig = LayoutConfig.fromResolved(this._savedLayout);
            this._goldenLayout.loadLayout(layoutConfig);
        }
    }

    getAllComponentTypeNames() {
        const result  = [];
        result.push(ColorComponent.typeName);
        result.push(TextComponent.typeName);
        result.push(BooleanComponent.typeName);
        result.push(EventComponent.typeName);
        return result;
    }

    loadComponentTypesForAddSelect() {
        this._registeredComponentTypesForAddSelect.options.length = 0;
        const names = this.getAllComponentTypeNames();
        for (const name of names) {
            const option = new Option(name);
            this._registeredComponentTypesForAddSelect.options.add(option);
        }
    }

    loadComponentTypesForReplaceSelect() {
        this._registeredComponentTypesForReplaceSelect.options.length = 0;
        const names = this.getAllComponentTypeNames();
        for (const name of names) {
            const option = new Option(name);
            this._registeredComponentTypesForReplaceSelect.options.add(option);
        }
    }

    loadLayoutSelect() {
        this._layoutSelect.options.length = 0;
        const layouts = prefinedLayouts.allComponents;
        for (const layout of layouts) {
            const option = new Option(layout.name);
            this._layoutSelect.options.add(option);
        }
    }

    replaceComponentRecursively(content , itemConfig ) {
        for (const item of content) {
            if (ContentItem.isComponentItem(item)) {
                const container = item.container;
                if (container.componentType === ColorComponent.typeName) {
                    container.replaceComponent(itemConfig);
                }
            } else {
                this.replaceComponentRecursively(item.contentItems, itemConfig);
            }
        }
    }

    numberToPixels(value )  {
        return value.toString(10) + 'px';
    }
}
