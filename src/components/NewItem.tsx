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
import { FreshItem } from "../helpers/interfaces";

interface NewItemProps {}

const NewItem = (props: NewItemProps) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const apiUser = process.env.REACT_APP_API_USERNAME;
  const apiPass = process.env.REACT_APP_API_PASSWORD;
  const apiKeyName = process.env.REACT_APP_API_KEY_NAME as string;
  const apiKeyValue = process.env.REACT_APP_API_KEY_VALUE;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const [toAdd, setToAdd] = useState<FreshItem>({});
  const toggle = () => setModal(!modal);
  const addItem = () => {
    setLoading(true);
    axios({
      method: "post",
      url: apiUrl + "/items",
      headers: {
        Authorization: "Basic " + window.btoa(apiUser + ":" + apiPass),
        [apiKeyName]: apiKeyValue,
      },
      data: toAdd,
    })
      .then((response) => {
        setLoading(false);
        toggle();
        alert("New item was created!");
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
  if (loading) {
    return (
      <div className="p-3">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <Button className="m-3" size="sm" color="dark" onClick={toggle}>
        Create
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
                <b>New item</b>
              </Col>
              <Col sm="2">
                <Label>TITLE: </Label>
              </Col>
              <Col sm="6">
                <Input
                  type="text"
                  className="bold"
                  value={title}
                  placeholder="Title"
                  onChange={(event) => {
                    setTitle(event.target.value);
                    let post = toAdd;
                    post.title = event.target.value;
                    setToAdd(post);
                  }}
                />
              </Col>
            </Row>
          </ModalHeader>
          <ModalBody>
            <Input
              required
              type="textarea"
              value={description}
              placeholder="Description"
              onChange={(event) => {
                setDescription(event.target.value);
                let post = toAdd;
                post.description = event.target.value;
                setToAdd(post);
              }}
            />
            <Row className="mt-3 text-right">
              <Col sm="6">
                <Label>PRICE: </Label>
              </Col>
              <Col sm="4">
                <Input
                  required
                  value={price}
                  placeholder="Price"
                  onChange={(event) => {
                    setPrice(event.target.value);
                    let post = toAdd;
                    post.price = event.target.value;
                    setToAdd(post);
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="dark" onClick={() => addItem()}>
              Save
            </Button>{" "}
            <Button color="dark" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default NewItem;
