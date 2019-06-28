import React from 'react';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import {
  COUNTRY_LIST,
  NATIONALITIES_LIST,
  SEX_TYPE,
  MRZ_TYPE,
} from '../const/constants';
import {mrz} from '../generator/Generator';

const nameRegex = RegExp(/^[a-zA-Z ']*$/);
const passRegex = RegExp(/^(?!^0+$)[a-zA-Z0-9]{3,9}$/);
const dateRegex = RegExp(/^\d{4}\/\d{2}\/\d{2}$/);
let customerDOB;


const formValid = ({formErrors, ...rest}) => {
  let valid = true;
  //validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });
  //validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });
  return valid;
};

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      dob: '',
      passportNumber: '',
      countryOfIssue: null,
      nationality: null,
      passExpDate: '',
      sex: null,
      result: '',
      personalNumber: '',
      dmzType: null,
      formErrors: {
        firstNameError: '',
        lastNameError: '',
        dobError: '',
        passNumError: '',
        countryError: '',
        nationError: '',
        personalNumber: '',
        passExpDateError: '',
      },
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log('handleSubmit');
    if (formValid(this.state)) {
      let {
        firstName,
        lastName,
        dob,
        passportNumber,
        countryOfIssue,
        personalNumber, passExpDate,
        sex,
        dmzType,
      } = this.state;

      dob = dob.slice(2).replace('/', '');
      passExpDate = passExpDate.slice(2).replace('/', '');
      sex = sex[0].toUpperCase();

      const res = mrz(dmzType, 'P', lastName, firstName, passportNumber,
          countryOfIssue,
          dob, sex, passExpDate, personalNumber,
      );
      this.setState((state) => {
        return {
          ...state,
          result: res,
        };
      });
    }
  };

  handleChange = e => {
    e.preventDefault();
    const {name, value} = e.target;
    let formErrors = this.state.formErrors;
    switch (name) {
      case 'firstName':
        formErrors.firstNameError = !nameRegex.test(value)
            ? formErrors.firstNameError = 'Please enter a valid name'
            : '';
        break;
      case 'lastName':
        formErrors.lastNameError = !nameRegex.test(value)
            ? formErrors.lastNameError = 'Please enter a valid last name'
            : '';
        break;
      case 'dob':
        //Check whether valid YYYY/MM/DD Date Format.
        if (dateRegex.test(value)) {
          const isValid = this.validateDOB(value);
          if (!isValid) {
            formErrors.dobError = 'Your age is not matching our requirements';
          } else {
            formErrors.dobError = '';
            customerDOB = value;
          }
        } else {
          formErrors.dobError = 'Please enter date in YYYY/MM/DD format.';
        }
        break;
      case 'passportNumber':
        formErrors.passNumError = !passRegex.test(value)
            ? 'Please enter a valid passport number.'
            : '';
        break;
      case 'personalNumber':
        formErrors.passNumError = !passRegex.test(value)
            ? 'Please enter a valid personal number.'
            : '';
        break;
      case 'countryOfIssue':
        formErrors.countryError = value.length < 6
            ? 'minimum 6 characters required'
            : '';
        break;
      case 'nationality':
        formErrors.nationError = value.length < 6
            ? 'minimum 6 characters required'
            : '';
        break;
      case 'passExpDate':
        if (dateRegex.test(value)) {
          const isValid = this.validateExpDate(value);
          formErrors.passExpDateError = !isValid
              ? 'Please enter valid expiration date.'
              : '';
        } else {
          formErrors.passExpDateError = 'Please enter date in YYYY/MM/DD format.';
        }
        break;
      default:
        break;
    }
    this.setState({formErrors, [name]: value}, () => console.log(this.state));
  };

  validateDOB = value => {
    let parts = value.split('/');
    let dtDOB = new Date(parts[1] + '/' + parts[2] + '/' + parts[0]);
    let dtCurrent = new Date();
    if (dtCurrent.getFullYear() - dtDOB.getFullYear() < 18 ||
        dtCurrent.getFullYear() - dtDOB.getFullYear() > 120) {
      return false;
    }
    if (dtCurrent.getFullYear() - dtDOB.getFullYear() === 18) {
      //CD: 2018/06/11 and DB: 2000/07/15. Will turn 18 on 15/07/2018.
      if (dtCurrent.getMonth() < dtDOB.getMonth()) {
        return false;
      }
      if (dtCurrent.getMonth() === dtDOB.getMonth()) {
        //CD: 2018/06/11 and DB: 2000/06/15. Will turn 18 on 15/06/2018.
        if (dtCurrent.getDate() < dtDOB.getDate()) {
          return false;
        }
      }
    }
    return true;
  };

  validateExpDate = value => {
    let partsPED = value.split('/');
    let dtPED = new Date(partsPED[1] + '/' + partsPED[2] + '/' + partsPED[0]);
    let partsDOB = customerDOB.split('/');
    let dtDOB = new Date(partsDOB[1] + '/' + partsDOB[2] + '/' + partsDOB[0]);
    let dtCurrent = new Date();
    let minDate = dtCurrent.setMonth(dtCurrent.getMonth() + 6);
    let maxDate = dtDOB.setFullYear(dtDOB.getFullYear() + 120);
    return !(dtPED < minDate || dtPED > maxDate);
  };

  render() {
    const {formErrors} = this.state;
    return (
        <div className="container">
          <div className='row justify-content-center'>
            <div className='col-md-4'>
              <h1>Create Account</h1>
              <form onSubmit={this.handleSubmit} noValidate>
                <div className="firstName">
                  <input required type="text"
                         className={formErrors.firstNameError.length > 0 ?
                             'error col-12' :
                             ' col-12'}
                         placeholder="First Name"
                         name="firstName"
                         onChange={this.handleChange}
                         maxLength={14}
                         noValidate
                  />
                  {formErrors.firstNameError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.firstNameError}</p>
                  )}
                </div>
                <div className="lastName row">
                  <div className='col-12'>
                    <input required type="text"
                           className={formErrors.lastNameError.length > 0 ?
                               'error col-12' :
                               ' col-12'}
                           placeholder="Last Name"
                           name="lastName"
                           onChange={this.handleChange}
                           maxLength={15}
                           noValidate
                    />
                    {formErrors.lastNameError.length > 0 && (
                        <p
                            className="errorMessage">{formErrors.lastNameError}</p>
                    )}</div>
                </div>
                <div className="dob">
                  <input required type="text"
                         className={formErrors.dobError.length > 0 ?
                             'error col-12' :
                             ' col-12'}
                         placeholder="DATE OF BIRTH YYYY/MM/DD"
                         name="dob"
                         onChange={this.handleChange}
                         noValidate
                  />
                  {formErrors.dobError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.dobError}</p>
                  )}
                </div>
                <div className="passportNumber">
                  <input required type="text"
                         className={formErrors.passNumError.length > 0 ?
                             'error col-12' :
                             ' col-12'}
                         placeholder="Passport Number"
                         name="passportNumber"
                         onChange={this.handleChange}
                         maxLength={9}
                         noValidate
                  />
                  {formErrors.passNumError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.passNumError}</p>
                  )}
                </div>
                <div className="personalNumber">
                  <input required type="text"
                         className={formErrors.passNumError.length > 0 ?
                             'error col-12' :
                             ' col-12'}
                         placeholder="Personal Number"
                         name="personalNumber"
                         onChange={this.handleChange}
                         maxLength={9}
                         noValidate
                  />
                  {formErrors.passNumError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.personalNumber}</p>
                  )}
                </div>
                <div className="passExpDate">
                  <input required type="text"
                         className={formErrors.passExpDateError.length > 0 ?
                             'error col-12' :
                             ' col-12'}
                         placeholder="Passport expiry YYYY/MM/DD"
                         name="passExpDate"
                         onChange={this.handleChange}
                         noValidate
                  />
                  {formErrors.passExpDateError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.passExpDateError}</p>
                  )}
                </div>
                <div
                    className="countryOfIssue row justify-content-between mt-2 col-12">
                  <label>Select country: </label>
                  <DropdownButton className='mb-2 dropdownButton'
                                  id="dropdown-item-button"
                                  title={this.state.countryOfIssue ||
                                  'Country of Issue'}>
                    {
                      COUNTRY_LIST.map((country, i) => {
                        return <Dropdown.Item key={i} as="button"
                                              onClick={() => {
                                                this.setState((state) => {
                                                  return {
                                                    ...state,
                                                    countryOfIssue: country.slice(
                                                        0, 3).toUpperCase(),
                                                  };
                                                });
                                              }}>{country}</Dropdown.Item>;
                      })
                    }
                  </DropdownButton>
                  {formErrors.countryError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.countryError}</p>
                  )}
                </div>

                <div
                    className="nationality row justify-content-between mt-2 col-12">
                  <label>Select nationality: </label>
                  <DropdownButton className='mb-2 dropdownButton'
                                  id="dropdown-item-button"
                                  title={this.state.nationality ||
                                  'Nationality'}>
                    {
                      NATIONALITIES_LIST.map((nationality, i) => {
                        return <Dropdown.Item key={i} as="button"
                                              onClick={() => {
                                                this.setState((state) => {
                                                  return {
                                                    ...state,
                                                    nationality: nationality,
                                                  };
                                                });
                                              }}>{nationality}</Dropdown.Item>;
                      })
                    }
                  </DropdownButton>
                  {formErrors.nationError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.nationError}</p>
                  )}
                </div>

                <div
                    className="sex row justify-content-between mt-2 col-12">
                  <label>Sex: </label>
                  <DropdownButton className='mb-2 dropdownButton'
                                  id="dropdown-item-button"
                                  title={this.state.sex ||
                                  'Sex'}>
                    {
                      SEX_TYPE.map((sex, i) => {
                        return <Dropdown.Item key={i} as="button"
                                              onClick={() => {
                                                this.setState((state) => {
                                                  return {
                                                    ...state,
                                                    sex: sex,
                                                  };
                                                });
                                              }}>{sex}</Dropdown.Item>;
                      })
                    }
                  </DropdownButton>
                  {formErrors.nationError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.nationError}</p>
                  )}
                </div>

                <div
                    className="dmzType row justify-content-between mt-2 col-12">
                  <label>Type mrz: </label>
                  <DropdownButton className='mb-2 dropdownButton'
                                  id="dropdown-item-button"
                                  title={this.state.dmzType ||
                                  'Type mrz'}>
                    {
                      MRZ_TYPE.map((type, i) => {
                        return <Dropdown.Item key={i} as="button"
                                              onClick={() => {
                                                this.setState((state) => {
                                                  return {
                                                    ...state,
                                                    dmzType: type,
                                                  };
                                                });
                                              }}>{type}</Dropdown.Item>;
                      })
                    }
                  </DropdownButton>
                  {formErrors.nationError.length > 0 && (
                      <p
                          className="errorMessage">{formErrors.nationError}</p>
                  )}
                </div>


                <div className="createAccount mt-2">
                  <input className='btn btn-success' value='Create Account'
                         type="submit"/>
                </div>
              </form>
              {
                this.state.result.length > 0 &&
                <h4 className='mt-3'>
                  {this.state.result}
                </h4>
              }
            </div>
          </div>
        </div>
    );
  }
}
