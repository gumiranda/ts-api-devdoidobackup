export default class ValidationContract {
  _errors: Array<any>;
  constructor() {
    this._errors = [];
  }

  isNotArrayOrEmpty(value, message) {
    if (!value && value.length == 0) {
      this._errors.push({ message });
      return false;
    } else {
      return true;
    }
  }

  isTrue(value, message) {
    if (value) {
      this._errors.push({ message });
      return false;
    } else {
      return true;
    }
  }

  isRequired(value, message) {
    if (!value || value.length <= 0) {
      this._errors.push({ message });
      return false;
    } else {
      return true;
    }
  }

  isEmail(value, message) {
    const reg = new RegExp(/^\w+([-+,']\w+)*@\w+([-,]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value)) {
      this._errors.push({ message });
      return false;
    } else {
      return true;
    }
  }

  errors() {
    return this._errors;
  }

  isValid() {
    return this._errors.length == 0;
  }
}
