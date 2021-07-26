export interface Customer {
  id: number;
  username: string;
  email: string;
  updated: string | null;
}

export interface CustomerToken {
  customer: Customer;
  token: string;
}

export interface Page {
  content: any[];
  pageable: Pageable | null;
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: Sort | null;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  active: boolean;
  creared: DOMStringList;
  updated: string;
}

/*
If present, the filters properties are joined with logical AND.
In each array of infinite length within a present property, 
substrings (title, description) or ranges (dash-separated)
are joined with logical OR.
*/
export interface Filters {
  id?: Array<string>;
  title?: Array<string>;
  description?: Array<string>;
  price?: Array<string>;
  created?: Array<string>;
  updated?: Array<string>;
}

export interface FreshItem {
  id?: string;
  title?: string;
  description?: string;
  price?: string; // TODO: transform comma into dot
  created?: string;
  updated?: string;
}

export interface CustomerToUpdate {
  username?: string;
  email?: string;
  password?: string;
}
