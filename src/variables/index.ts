// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { IDebugger } from '../tokens';

import { Panel, Widget } from '@lumino/widgets';

import { VariablesBody } from './body';

import { VariablesBodyTable } from './table';

import { VariablesHeader } from './header';

import { ToolbarButton } from '@jupyterlab/apputils';
import { VariablesModel } from './model';

/**
 * A Panel to show a variable explorer.
 */
export class Variables extends Panel {
  /**
   * Instantiate a new Variables Panel.
   * @param options The instantiation options for a Variables Panel.
   */
  constructor(options: Variables.IOptions) {
    super();

    const { model, service } = options;

    this._header = new VariablesHeader();
    this._tree = new VariablesBody(model);
    this._table = new VariablesBodyTable({ model, service });
    this._table.hide();

    const onClick = () => {
      if (this._table.isHidden) {
        this._tree.hide();
        this._table.show();
        this.node.setAttribute('data-jp-table', 'true');
      } else {
        this._tree.show();
        this._table.hide();
        this.node.removeAttribute('data-jp-table');
      }
      this.update();
    };

    this._header.toolbar.addItem(
      'view-VariableSwitch',
      new ToolbarButton({
        className: 'jp-SwitchButton',
        iconClass: 'jp-ToggleSwitch',
        onClick,
        tooltip: 'Table / Tree View'
      })
    );

    this.addWidget(this._header);
    this.addWidget(this._tree);
    this.addWidget(this._table);
    this.addClass('jp-DebuggerVariables');
  }

  private _header: VariablesHeader;
  private _tree: Widget;
  private _table: Widget;

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this._resizeBody(msg);
  }

  /**
   * Resize the body.
   * @param msg The resize message.
   */
  private _resizeBody(msg: Widget.ResizeMessage) {
    const height = msg.height - this._header.node.offsetHeight;
    this._table.node.style.height = `${height}px`;
  }
}

/**
 * A namespace for Variables `statics`.
 */
export namespace Variables {
  /**
   * Instantiation options for `Variables`.
   */
  export interface IOptions extends Panel.IOptions {
    /**
     * The variables model.
     */
    model: VariablesModel;
    /**
     * The debugger service.
     */
    service: IDebugger;
  }
}
