import React from 'react';
import './_subText.scss';

const SubText = (props) => {
  const { text, greyboxText, color } = props;
  return <div className="component SubText">
    <h1 style={{color}}>{text}</h1>
    {greyboxText && <p className="SubText__greybox">{greyboxText}</p>}
  </div>;
};

SubText.propTypes = {
  text: React.PropTypes.string,
  greyboxText: React.PropTypes.string,
  color: React.PropTypes.string
};
export default SubText;
