import { SyntheticEvent, useState } from "react";
import {
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";

export interface PageProps {
  heads: string[];
  goto: any;
  last: boolean;
  first: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
}

export const PAGE_SIZES: number[] = [2, 5, 10, 20, 50, 100];

const PageNav: React.FunctionComponent<PageProps> = (props) => {
  const currentZeroBased = props.number;
  const size: string = props.size.toString();
  const pages: number[] = Array.from(Array(props.totalPages).keys());
  const [pageNumber, setPageNumber] = useState<number>(currentZeroBased);
  const changePerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const perPage = event.target.value;
    setPageNumber(0);
    props.goto("?page=0&size=" + perPage);
  };
  const changePage = (event: SyntheticEvent, p: number) => {
    event.preventDefault();
    setPageNumber(p);
    props.goto("?page=" + p + "&size=" + size);
  };
  return (
    <Row>
      <Col>
        <small className="text-muted">
          {props.numberOfElements} of total {props.totalElements} items
        </small>
        <p>
          <label className="mr-1">Per page: </label>
          <select value={size} onChange={(event) => changePerPage(event)}>
            {PAGE_SIZES.map((pp) => (
              <option key={pp}>{pp}</option>
            ))}
          </select>
        </p>
      </Col>
      <Col>
        <Pagination>
          <PaginationItem>
            {props.first ? (
              <PaginationLink disabled first />
            ) : (
              <PaginationLink
                title="First page"
                onClick={(event) => changePage(event, 0)}
                first
              />
            )}
          </PaginationItem>
          <PaginationItem>
            {props.first ? (
              <PaginationLink disabled previous />
            ) : (
              <PaginationLink
                title="Previous page"
                onClick={(event) => changePage(event, pageNumber - 1)}
                previous
              />
            )}
          </PaginationItem>
          {pages.map((p) => {
            if (p > currentZeroBased - 3 && p < currentZeroBased + 3) {
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    className={p === currentZeroBased ? "active" : ""}
                    onClick={(event) => changePage(event, p)}
                  >
                    {p + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            return "";
          })}
          <PaginationItem>
            {pageNumber === props.totalPages - 1 || props.totalPages === 1 ? (
              <PaginationLink disabled next />
            ) : (
              <PaginationLink
                title="Next page"
                onClick={(event) => changePage(event, pageNumber + 1)}
                next
              />
            )}
          </PaginationItem>
          <PaginationItem>
            {props.last ? (
              <PaginationLink disabled last />
            ) : (
              <PaginationLink
                title="Last page"
                onClick={(event) => changePage(event, props.totalPages - 1)}
                last
              />
            )}
          </PaginationItem>
        </Pagination>
      </Col>
    </Row>
  );
};

export default PageNav;
