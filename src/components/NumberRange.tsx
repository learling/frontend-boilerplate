import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

export interface NumberRangeProps {
  head: string;
  display: boolean;
  submitRange: (range?: string) => void;
}

const NumberRange: React.FunctionComponent<NumberRangeProps> = (props) => {
  const [minNumber, setMinNumber] = useState<string>("0");
  const [maxNumber, setMaxNumber] = useState<string>("0");
  const handleSubmit = (submit: boolean) => {
    if (submit && minNumber && maxNumber !== "0") {
      let range = minNumber + " - " + maxNumber;
      if (parseInt(minNumber) > parseInt(maxNumber)) {
        range = maxNumber + " - " + minNumber;
      }
      props.submitRange(range);
    } else {
      props.submitRange();
    }
  };
  return (
    <Container
      className={
        props.display === true
          ? "position-absolute d-flex w-100"
          : "h-0 invisible"
      }
    >
      <Card className="shadow mx-auto">
        <CardHeader>
          <h5>Filter {props.head.toUpperCase()} range</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col sm="4">
              <Input
                min="0"
                type="number"
                onChange={(event) => {
                  setMinNumber(event.target.value);
                }}
                placeholder="Minimum"
              />
            </Col>
            <Col sm="1" className="text-center">
              -
            </Col>
            <Col sm="4">
              <Input
                min="0"
                type="number"
                onChange={(event) => {
                  setMaxNumber(event.target.value);
                }}
                placeholder="Maximum"
              />
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="text-right">
          <Button
            color="dark"
            onClick={() => handleSubmit(true)}
            title={
              "You can also directly type " +
              maxNumber +
              " or " +
              minNumber +
              "-" +
              maxNumber +
              " in the " +
              props.head.toUpperCase() +
              " field and press Enter"
            }
          >
            Apply
          </Button>{" "}
          <Button color="dark" onClick={() => handleSubmit(false)}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default NumberRange;
