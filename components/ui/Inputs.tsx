import React, { useEffect, useRef, useState } from "react";

export const ResizableTextarea = ({ value, minRows = 1, maxRows = 1, ...props }: any) => {
  const [rows, setRows] = useState(minRows);
  const textAreaRef = useRef<any>();

  useEffect(() => {

    if (textAreaRef.current) {
      const textareaLineHeight = 24;

      const previousRows = textAreaRef.current.rows;
      textAreaRef.current.rows = minRows; // reset number of rows in textarea 

      const currentRows = ~~(textAreaRef.current.scrollHeight / textareaLineHeight);

      if (currentRows === previousRows) {
        textAreaRef.current.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        textAreaRef.current.rows = maxRows;
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
      }

      setRows(currentRows < maxRows ? currentRows : maxRows);

    } else {
      setRows(minRows);
    }
  }, [value, minRows, maxRows, textAreaRef])

  return (
    <textarea
      ref={textAreaRef}
      rows={rows}
      value={value}
      {...props} />
  );
}
