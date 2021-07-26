import axios from "axios";
import { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { formatAMPM } from "../helpers/functions";
import { FreshItem } from "../helpers/interfaces";

interface ItemProps {
  item: any;
}

const Item = (props: ItemProps) => {
  // TODO: check locked
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [title, setTitle] = useState<string>(props.item.title);
  const [description, setDescription] = useState<string>(
    props.item.description
  );
  const [price, setPrice] = useState<string>(props.item.price);
  const [edited, setEdited] = useState<string>("");
  const [toUpdate, setToUpdate] = useState<FreshItem>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  let text = props.item.description;
  if (text.length > 99) text = `${text.substring(0, 99)}...`;
  const created = props.item.created
    ? props.item.created.replaceAll("T", " ").replaceAll(/:\d\d$/g, "")
    : "";
  const updated = props.item.updated
    ? props.item.updated.replaceAll("T", " ").replaceAll(/:\d\d$/g, "")
    : "";
  const deleteItem = () => {
    setLoading(true);
    axios({
      method: "delete",
      url: apiUrl + "/items/" + props.item.id,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
    })
      .then((response) => {
        setEdited(
          "Deleted on " + formatAMPM(new Date()) + " (please refresh the page)"
        );
        toggle();
        setLoading(false);
      })
      .catch((error) => {
        if ([401, 422].includes(error.response.status)) {
          alert("Error: " + error.response.data);
        } else {
          alert("Error: You may refresh or try again later.");
        }
        setLoading(false);
      });
  };
  const updateItem = () => {
    setLoading(true);
    axios({
      method: "patch",
      url: apiUrl + "/items/" + props.item.id,
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
      data: toUpdate,
    })
      .then((response) => {
        setEdited(
          "Updated on " +
            formatAMPM(new Date()) +
            " (refresh to see the update)"
        );
        toggle();
        setLoading(false);
      })
      .catch((error) => {
        if ([401, 422].includes(error.response.status)) {
          alert("Error: " + error.response.data);
        } else {
          alert("Error: You may refresh or try again later.");
        }
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <div className="p-3">
        <Spinner />
        <span> Updating item...</span>
      </div>
    );
  }
  return (
    <tr>
      <td>
        <b>{props.item.id}</b>
        <div className="text-success">{edited}</div>
      </td>
      <td>{props.item.title}</td>
      <td>{text}</td>
      <td>{props.item.price}</td>
      <td>{created}</td>
      <td>{updated}</td>
      <td>
        <Button size="sm" color="dark" onClick={toggle}>
          Edit
        </Button>
        <Modal
          fade={false}
          isOpen={modal}
          toggle={toggle}
          centered={true}
          size="lg"
        >
          <Form>
            <ModalHeader toggle={toggle}>
              <Row>
                <Col sm="4">
                  <b>ID: {props.item.id}</b>
                </Col>
                <Col sm="2">
                  <Label>TITLE: </Label>
                </Col>
                <Col sm="6">
                  <Input
                    type="text"
                    className="bold"
                    value={title}
                    placeholder="TITLE"
                    onChange={(event) => {
                      setTitle(event.target.value);
                      let patch = toUpdate;
                      patch.title = event.target.value;
                      setToUpdate(patch);
                    }}
                  />
                </Col>
              </Row>
            </ModalHeader>
            <ModalBody>
              <Input
                type="textarea"
                value={description}
                placeholder="DESCRIPTION"
                onChange={(event) => {
                  setDescription(event.target.value);
                  let patch = toUpdate;
                  patch.description = event.target.value;
                  setToUpdate(patch);
                }}
              />
              <Row className="mt-3 text-right">
                <Col sm="6">
                  <Label>PRICE: </Label>
                </Col>
                <Col sm="4">
                  <Input
                    value={price}
                    placeholder="PRICE"
                    onChange={(event) => {
                      setPrice(event.target.value);
                      let patch = toUpdate;
                      patch.price = event.target.value;
                      setToUpdate(patch);
                    }}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <small className="mt-3 text-muted">
                    Created on: {" " + created || " "}
                  </small>
                </Col>
                <Col>
                  <small className="mt-3 text-muted">
                    Last edit: <span>{updated || "Item not updated yet"}</span>
                  </small>
                </Col>
              </Row>
              <hr />
              <Button color="danger" onClick={() => deleteItem()}>
                Delete item
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="dark" onClick={() => updateItem()}>
                Save
              </Button>{" "}
              <Button color="dark" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </td>
    </tr>
  );
};

export default Item;
