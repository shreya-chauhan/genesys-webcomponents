export interface IColumnResizeState {
  resizableColumn: HTMLElement;
  resizableColumnInitialWidth: number;
  columnResizeMouseStartX: number;
}

export interface ISortState {
  columnName: string;
  sortDirection: string;
}

export interface ISelectedState {
  rowIds: string[];
  actionType: 'selected' | 'unselected';
}
