import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMessages from '../containers/withMessages.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';

class Flash extends PureComponent {
  constructor() {
    super();
    this.dismissFlash = this.dismissFlash.bind(this);
  }

  // TODO: reenable if still useful, otherwise delete
  // componentDidMount() {
  //   this.props.markAsSeen && this.props.markAsSeen(this.props.message._id);
  // }

  dismissFlash(e) {
    e.preventDefault();
    this.props.clear(this.props.message._id);
  }

  getProperties = () => {
    const errorObject = this.props.message;
    if (typeof errorObject === 'string') {
      // if error is a string, use it as message
      return {
        message: errorObject,
        type: 'error'
      };
    } else {
      // else return full error object after internationalizing message
      const { id, message, properties } = errorObject;
      const translatedMessage = this.context.intl.formatMessage(
        { id, defaultMessage: message },
        properties
      );
      return {
        ...errorObject,
        message: translatedMessage
      };
    }
  };

  render() {

    const { message, type = 'danger' } = this.getProperties();
    const flashType = type === 'error' ? 'danger' : type; // if flashType is "error", use "danger" instead

    return (
      <Components.Alert className="flash-message" variant={flashType} onClose={this.dismissFlash}>
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </Components.Alert>
    );
  }
}

Flash.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.string.isRequired])
};

Flash.contextTypes = {
  intl: intlShape
};

registerComponent('Flash', Flash);

const FlashMessages = ({messages, className, ...flashActions}) => {
  return (
    <div className={`flash-messages ${className}`}>
      {messages
        // .filter(message => message.show)
        .map((message, i) => <Components.Flash key={i} message={message} {...flashActions} />)}
    </div>
  );
};

FlashMessages.displayName = 'FlashMessages';
FlashMessages.propTypes = {
  messages: PropTypes.array.isRequired
};

registerComponent('FlashMessages', FlashMessages, withMessages);

export default withMessages(FlashMessages);
