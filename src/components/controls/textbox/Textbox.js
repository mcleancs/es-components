import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { noop, omit } from 'lodash';
import MaskedInput from '../../util/ReactTextMask';

import Icon from '../../base/icons/Icon';
import { sizes } from '../../theme';
import { LabelText, InputBase } from '../BaseControls';
import Label from '../Label';
import {
  validationIconName,
  validationTextColor,
  validationInputColor
} from '../validationStateVars';
import genId from '../../util/generateAlphaName';
import inputMaskType from './inputMaskType';

const defaultInputPad = '12px';
const rightPad = {
  0: defaultInputPad,
  1: '2em',
  2: '3.6em'
};
const paddings = css`
  padding-left: ${props => (props.hasPrepend ? '2em' : defaultInputPad)};
  padding-right: ${props => rightPad[props.numAppendIconNames]};
`;

const TextBoxLabel = styled(Label)`
  flex-basis: 50%;
`;

// apply styles to masked input, but remove props it doesn't use
const StyledMaskedInput = InputBase.withComponent(props => (
  <MaskedInput
    {...omit(props, [
      'borderColor',
      'boxShadow',
      'focusBorderColor',
      'focusBoxShadow',
      'hasPrepend',
      'initialValue',
      'numAppendIconNames'
    ])}
  />
));
const StyledMask = StyledMaskedInput.extend`
  ${paddings};
`;

const StyledText = styled(InputBase)`
  ${paddings};
`;

const AdditionalHelpContent = styled.div`
  font-size: ${sizes.baseFontSize}px;
  font-weight: normal;
  margin: 10px 0 20px 0;
  text-transform: none;
`;

const TextWrapper = styled.div`
  flex: auto;
  margin-right: ${props => (props.includeMargin ? '20px' : '0')};
  position: relative;
`;

const addonAttrs = `
  font-weight: normal;
  pointer-events: none;
  position: absolute;
  top: 9px;
`;

const Prepend = styled(Icon)`
  ${addonAttrs} left: 9px;
`;

const Append = styled.div`
  ${addonAttrs} right: 9px;

  i {
    margin-left: 9px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex: auto;
`;

const Textbox = props => {
  const {
    labelText,
    name,
    value,
    inline,
    inputRef,
    additionalHelpContent,
    validationState,
    prependIconName,
    appendIconName,
    onChange,
    onBlur,
    maskType,
    ...additionalTextProps
  } = props;

  const hasHelpContent = additionalHelpContent !== undefined;
  const helpId = hasHelpContent ? genId() : null;
  const additionalHelp = hasHelpContent && (
    <AdditionalHelpContent id={helpId} className="textbox__help">
      {additionalHelpContent}
    </AdditionalHelpContent>
  );

  const hasPrepend = prependIconName !== undefined;
  const hasAppend = appendIconName !== undefined;
  const hasValidationIcon = validationState !== 'normal';

  let numAppendIconNames = 0;
  if (hasAppend) numAppendIconNames++;
  if (hasValidationIcon) numAppendIconNames++;

  const Input = maskType === 'none' ? StyledText : StyledMask;
  const maskArgs = inputMaskType[maskType];

  const inputName = name || labelText.replace(/\s+/g, '');
  const textboxId = genId();

  return (
    <TextBoxLabel
      htmlFor={textboxId}
      color={validationTextColor[validationState]}
      inline={inline}
    >
      <LabelText inline={inline}>{labelText}</LabelText>
      <InputWrapper>
        <TextWrapper includeMargin={inline}>
          {hasPrepend && <Prepend name={prependIconName} size={20} />}
          <Input
            aria-describedby={helpId}
            hasPrepend={hasPrepend}
            id={textboxId}
            innerRef={inputRef}
            name={inputName}
            numAppendIconNames={numAppendIconNames}
            onBlur={onBlur}
            onChange={onChange}
            type="text"
            value={value}
            {...additionalTextProps}
            {...validationInputColor[validationState]}
            {...maskArgs}
          />
          {(hasAppend || hasValidationIcon) && (
            <Append>
              {hasValidationIcon && (
                <Icon name={validationIconName[validationState]} size={20} />
              )}
              {hasAppend && <Icon name={appendIconName} size={20} />}
            </Append>
          )}
        </TextWrapper>
      </InputWrapper>
      {additionalHelp}
    </TextBoxLabel>
  );
};

Textbox.propTypes = {
  labelText: PropTypes.string.isRequired,
  /** The name of the input */
  name: PropTypes.string,
  /** Reference to the underlying input DOM element */
  inputRef: PropTypes.func,
  /** Display label inline with text box */
  inline: PropTypes.bool,
  /** Function to execute when text box value changes */
  onChange: PropTypes.func,
  /** Function to execute when text box loses focus */
  onBlur: PropTypes.func,
  /** Content to display underneath the text box */
  additionalHelpContent: PropTypes.node,
  /** Display label and text with contextual state colorings */
  validationState: PropTypes.oneOf(['normal', 'success', 'warning', 'danger']),
  /** Content to prepend input box with */
  prependIconName: PropTypes.string,
  /** Content to append to input box */
  appendIconName: PropTypes.string,
  /** Set the initial value, uncontrolled mode */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Value of the textbox */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Sets a mask type on the input */
  maskType: PropTypes.oneOf(['none', 'date', 'dollar', 'phone', 'ssnum', 'zip'])
};

Textbox.defaultProps = {
  inline: false,
  maskType: 'none',
  onChange: noop,
  onBlur: noop,
  validationState: 'normal'
};

export default Textbox;
