export interface ColumnDefinition {
  key: string;                
  label: string;             
  type?: 'text' | 'chip' | 'icon' | 'actions'; 
  colorFn?: (element: any) => string;  
  tooltip?: string;           
  icon?: string;              
  format?: (element: any) => string;  
}