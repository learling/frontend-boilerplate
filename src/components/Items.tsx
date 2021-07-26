import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Input, Spinner, Table } from "reactstrap";
import { Filters, Page } from "../helpers/interfaces";
import PageNav from "./PageNav";
import Item from "./Item";
import DatetimeRange from "./DatetimeRange";
import NumberRange from "./NumberRange";
import NewItem from "./NewItem";

export interface ItemsProps {}

const Items: React.FunctionComponent<ItemsProps> = (props) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const filtersRef = useRef({});
  // use ref instead of state because state won't update immediatly (?)
  //const [filters, setFilters] = useState<Filters>({});
  const [pageSize, setPageSize] = useState<string>("?page=0&size=5");
  const [sortOrder, setSortOrder] = useState<string>("&sort=id,asc");
  const [loading, setLoading] = useState<boolean>(true);
  const [createdPicker, setCreatedPicker] = useState<boolean>(false);
  const [updatedPicker, setUpdatedPicker] = useState<boolean>(false);
  const [pricePicker, setPricePicker] = useState<boolean>(false);
  const [idPicker, setIdPicker] = useState<boolean>(false);
  const [page, setPage] = useState<Page>({
    content: [],
    pageable: null,
    last: true,
    totalPages: 0,
    totalElements: 0,
    sort: null,
    first: true,
    size: 0,
    number: 0,
    numberOfElements: 0,
    empty: true,
  });
  // head-strings are property-names of Filters-object
  const heads: string[] = [
    "id",
    "title",
    "description",
    "price",
    "created",
    "updated",
  ];
  const togglePicker = (head: string) => {
    switch (head) {
      case "created":
        setCreatedPicker((prevState) => !prevState);
        setUpdatedPicker(false);
        setPricePicker(false);
        setIdPicker(false);
        break;
      case "updated":
        setUpdatedPicker((prevState) => !prevState);
        setCreatedPicker(false);
        setPricePicker(false);
        setIdPicker(false);
        break;
      case "price":
        setPricePicker((prevState) => !prevState);
        setCreatedPicker(false);
        setUpdatedPicker(false);
        setIdPicker(false);
        break;
      case "id":
        setIdPicker((prevState) => !prevState);
        setCreatedPicker(false);
        setUpdatedPicker(false);
        setPricePicker(false);
        break;
      default:
        setCreatedPicker(false);
        setUpdatedPicker(false);
        setPricePicker(false);
        setIdPicker(false);
    }
  };
  const editFilter = (head: string, filter: string | undefined) => {
    if (!filter || filter.length > 0) {
      const currentFilters: Filters = filtersRef.current;
      let filtersArray: string[] = [];
      heads.forEach((key) => {
        if (head === key)
          filtersArray = currentFilters[head as keyof Filters] || [];
      });
      if (filter) {
        filtersArray.push(filter);
        filtersRef.current = {
          ...currentFilters,
          [head]: filtersArray,
        };
      } else {
        filtersRef.current = {
          ...currentFilters,
          [head]: undefined,
        };
      }
      setPageSize((prevState) => prevState.replaceAll(/page=\d+/g, "page=0"));
      filterItems();
    }
  };
  const filterItems = () => {
    setLoading(true);
    axios({
      method: "post",
      url: apiUrl + "/items/filter" + pageSize + sortOrder,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
      data: filtersRef.current,
    })
      .then((response) => {
        setPage(response.data);
        setLoading(false);
        setCreatedPicker(false);
        setUpdatedPicker(false);
        setPricePicker(false);
        setIdPicker(false);
      })
      .catch((error) => {
        if ([401, 422].includes(error.response.status)) {
          alert("Error: " + error.response.data);
        } else {
          alert("Error: Please try again later.");
        }
        setLoading(false);
      });
  };
  useEffect(() => {
    filterItems();
    //setFilters({});
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    filterItems();
    // eslint-disable-next-line
  }, [pageSize]);
  useEffect(() => {
    filterItems();
    // eslint-disable-next-line
  }, [sortOrder]);
  return (
    <>
      <h3>Dummy records</h3>
      {/*pageSize + sortOrder*/}
      <PageNav
        {...page}
        heads={heads}
        goto={(ps: string) => {
          setPageSize(ps);
        }}
      />
      <Button size="sm" color="dark" onClick={() => filterItems()}>
        Refresh
      </Button>
      <NewItem />
      {heads.map((head, index) => {
        let filtersArray = (filtersRef.current as Filters)[
          head as keyof Filters
        ];
        if (filtersArray) {
          return (
            <Badge pill className="pt-1" color="dark" key={head + "-" + index}>
              <span>{head.toUpperCase() + ": " + filtersArray.join(", ")}</span>
              <Button
                close
                title="Remove this filter"
                className="pt-0 mt-n2 ml-3 mb-n1 text-light"
                onClick={() => {
                  editFilter(head, undefined);
                }}
              />
            </Badge>
          );
        }
        return "";
      })}
      {loading ? (
        <Spinner />
      ) : (
        <Table>
          <thead>
            <tr>
              {heads.map((head, index) => {
                return (
                  <th
                    key={head + "-" + index}
                    title={"Filter " + head.toUpperCase()}
                  >
                    <Input
                      id={head + "-" + index}
                      bsSize="sm"
                      className="text-center p-0"
                      placeholder={head.toUpperCase()}
                      onClick={() => togglePicker(head)}
                      onBlur={(event) => {
                        event.target.value.length > 0 &&
                          editFilter(head, event.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          let inputElement = document.getElementById(
                            head + "-" + index
                          ) as HTMLInputElement;
                          editFilter(head, inputElement.value);
                        }
                      }}
                    />
                    <Button
                      className="mt-1 mb-n2"
                      color="light"
                      size="sm"
                      onClick={() => {
                        setSortOrder("&sort=" + head + ",asc");
                      }}
                    >
                      ^
                    </Button>
                  </th>
                );
              })}
              <th></th>
            </tr>
            <NumberRange
              head={"id"}
              display={idPicker}
              submitRange={(range?: string) => {
                range && editFilter("id", range);
                togglePicker("id");
              }}
            />
            <NumberRange
              head={"price"}
              display={pricePicker}
              submitRange={(range?: string) => {
                range && editFilter("price", range);
                togglePicker("price");
              }}
            />
            <DatetimeRange
              head={"created"}
              display={createdPicker}
              submitRange={(range?: string) => {
                range && editFilter("created", range);
                togglePicker("created");
              }}
            />
            <DatetimeRange
              head={"updated"}
              display={updatedPicker}
              submitRange={(range?: string) => {
                range && editFilter("updated", range);
                togglePicker("updated");
              }}
            />
          </thead>
          <tbody>
            {loading ? (
              <Spinner color="primary" />
            ) : (
              (page as Page).content.map((item: any) => {
                return <Item key={item.id} item={item} />;
              })
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default Items;
