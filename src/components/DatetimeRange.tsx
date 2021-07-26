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
  Label,
  Row,
} from "reactstrap";
import { formatAMPM } from "../helpers/functions";

export interface DaterangeProps {
  head: string;
  display: boolean;
  submitRange: (range?: string) => void;
}

const DatetimeRange: React.FunctionComponent<DaterangeProps> = (props) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [fromTime, setFromTime] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const handleSubmit = (submit: boolean) => {
    if (submit && fromDate && fromTime && toDate && toTime) {
      const from = formatAMPM(new Date(fromDate + "T" + fromTime));
      const to = formatAMPM(new Date(toDate + "T" + toTime));
      const range = from + " - " + to;
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
          <h5>Filter {props.head.toUpperCase()} daterange</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <Label>From</Label>
              <Input
                onChange={(event) => setFromDate(event.target.value)}
                type="date"
              />
              <Input
                onChange={(event) => setFromTime(event.target.value)}
                className="mt-2 mb-3"
                type="time"
              />
            </Col>
            <Col>
              <Label>To</Label>
              <Input
                onChange={(event) => setToDate(event.target.value)}
                type="date"
              />
              <Input
                onChange={(event) => setToTime(event.target.value)}
                className="mt-2"
                type="time"
              />
            </Col>
          </Row>
        </CardBody>
        <CardFooter className="text-right">
          <Button color="dark" onClick={() => handleSubmit(true)}>
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

export default DatetimeRange;
