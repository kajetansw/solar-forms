import { isRecord } from '../../guards';

interface BoolRecord {
  [key: string]: boolean | BoolRecord;
}

export const everyKey = (value: boolean) => (record: BoolRecord) => {
  let output = true as boolean;

  for (const key of Object.keys(record)) {
    const v = record[key];
    if (isRecord(v)) {
      output = output && everyKey(value)(v);
    } else {
      output = value ? output && v : output && !v;
    }
  }

  return output;
};

function cloneDeep(record: BoolRecord): BoolRecord {
  let output = {} as BoolRecord;

  for (const key of Object.keys(record)) {
    const recordValue = record[key];
    if (isRecord(recordValue)) {
      output = { ...output, [key]: cloneDeep(recordValue) };
    } else {
      output = { ...output, [key]: recordValue };
    }
  }

  return output;
}

export const setEveryKey = (value: boolean) => (record: BoolRecord) => {
  const clonedRecord = cloneDeep(record);

  for (const key of Object.keys(record)) {
    const recordValue = record[key];
    if (isRecord(recordValue)) {
      clonedRecord[key] = setEveryKey(value)(recordValue);
    } else {
      clonedRecord[key] = value;
    }
  }

  return clonedRecord;
};
