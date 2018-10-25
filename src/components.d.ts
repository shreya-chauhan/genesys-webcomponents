/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';




export namespace Components {

  interface GenesysButton {
    /**
    * The component accent (secondary or primary).
    */
    'accent': string;
    /**
    * Indicate if the button is disabled or not
    */
    'disabled': boolean;
    /**
    * The component left icon.
    */
    'leftIcon': string;
    /**
    * The component right icon.
    */
    'rightIcon': string;
    /**
    * The component text.
    */
    'text': string;
  }
  interface GenesysButtonAttributes extends StencilHTMLAttributes {
    /**
    * The component accent (secondary or primary).
    */
    'accent'?: string;
    /**
    * Indicate if the button is disabled or not
    */
    'disabled'?: boolean;
    /**
    * The component left icon.
    */
    'leftIcon'?: string;
    /**
    * The component right icon.
    */
    'rightIcon'?: string;
    /**
    * The component text.
    */
    'text'?: string;
  }

  interface GenesysPaginationButtons {
    'currentPage': number;
    'totalPages': number;
  }
  interface GenesysPaginationButtonsAttributes extends StencilHTMLAttributes {
    'currentPage'?: number;
    'onPageChanged'?: (event: CustomEvent<number>) => void;
    'totalPages'?: number;
  }

  interface GenesysPagination {
    'currentPage': number;
    'itemsPerPage': number;
    'totalItems': number;
  }
  interface GenesysPaginationAttributes extends StencilHTMLAttributes {
    'currentPage'?: number;
    'itemsPerPage'?: number;
    'totalItems'?: number;
  }
}

declare global {
  interface StencilElementInterfaces {
    'GenesysButton': Components.GenesysButton;
    'GenesysPaginationButtons': Components.GenesysPaginationButtons;
    'GenesysPagination': Components.GenesysPagination;
  }

  interface StencilIntrinsicElements {
    'genesys-button': Components.GenesysButtonAttributes;
    'genesys-pagination-buttons': Components.GenesysPaginationButtonsAttributes;
    'genesys-pagination': Components.GenesysPaginationAttributes;
  }


  interface HTMLGenesysButtonElement extends Components.GenesysButton, HTMLStencilElement {}
  var HTMLGenesysButtonElement: {
    prototype: HTMLGenesysButtonElement;
    new (): HTMLGenesysButtonElement;
  };

  interface HTMLGenesysPaginationButtonsElement extends Components.GenesysPaginationButtons, HTMLStencilElement {}
  var HTMLGenesysPaginationButtonsElement: {
    prototype: HTMLGenesysPaginationButtonsElement;
    new (): HTMLGenesysPaginationButtonsElement;
  };

  interface HTMLGenesysPaginationElement extends Components.GenesysPagination, HTMLStencilElement {}
  var HTMLGenesysPaginationElement: {
    prototype: HTMLGenesysPaginationElement;
    new (): HTMLGenesysPaginationElement;
  };

  interface HTMLElementTagNameMap {
    'genesys-button': HTMLGenesysButtonElement
    'genesys-pagination-buttons': HTMLGenesysPaginationButtonsElement
    'genesys-pagination': HTMLGenesysPaginationElement
  }

  interface ElementTagNameMap {
    'genesys-button': HTMLGenesysButtonElement;
    'genesys-pagination-buttons': HTMLGenesysPaginationButtonsElement;
    'genesys-pagination': HTMLGenesysPaginationElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
