interface ToJSONProps {
  value: unknown;
}

const ToJSON = (props: ToJSONProps) => <code>{JSON.stringify(props.value, null, 4)}</code>;

export default ToJSON;
