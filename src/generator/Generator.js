export function mrz(
    dmzType, type, surname, names, passportNumber, countryCode, bday, sex,
    expiry, personalNumber) {
  names = names.replace(' ', '<');
  type = type.toUpperCase();
  surname = surname.toUpperCase();
  names = names.toUpperCase();
  passportNumber = passportNumber.toUpperCase();
  countryCode = countryCode.toUpperCase();
  sex = sex.toUpperCase();

  switch (dmzType) {
    case 'TD1' :
      return td1(type, surname, names, passportNumber, countryCode, bday, sex,
          expiry);
    case 'TD2' :
      return td2(type, surname, names, passportNumber, countryCode, bday, sex,
          expiry);
    case 'TD3' :
      return td3(type, surname, names, passportNumber, countryCode, bday, sex,
          expiry, personalNumber);
    default:
      return console.log('Type error');
  }
}

function td1(
    type, surname, names, passportNumber, countryCode, bday, sex, expiry) {
  let totalSize = 36;
  let upperRow = type + '<' + countryCode + passportNumber + '7' + offset(
      totalSize - type.length - countryCode.length - passportNumber.length - 2);
  let middleRow = bday + '2' + sex + expiry + '9' + countryCode + offset(
      totalSize - bday.length - sex.length - expiry.length -
      countryCode.length - 3) + '6';
  let bottomRow = surname + '<<' + names +
      offset(totalSize - surname.length - names.length - 2);
  return upperRow + '\n' + middleRow + '\n' + bottomRow;

}

function td2(
    type, surname, names, passportNumber, countryCode, bday, sex, expiry) {
  let totalSize = 36;
  let upperRow = type + '<' + surname + '<<' + names +
      offset(totalSize - type.length - surname.length - names.length - 3);
  let bottomRow = passportNumber + '7' + countryCode + bday + '2' + sex +
      expiry + '9' + offset(
          totalSize - passportNumber.length - countryCode.length - bday.length -
          sex.length - expiry.length - 4) + '6';
  return upperRow + '\n' + bottomRow;

}

function td3(
    type, surname, names, passportNumber, countryCode, bday, sex, expiry,
    personalNumber) {
  let totalSize = 44;
  let upperRow = type + '<' + surname + '<<' + names +
      offset(totalSize - type.length - surname.length - names.length - 3);
  let bottomRow = passportNumber + '7' + countryCode + bday + '2' + sex +
      expiry + '9' + personalNumber + offset(
          totalSize - passportNumber.length - countryCode.length - bday.length -
          sex.length - expiry.length - personalNumber.length - 5) + '10';
  return upperRow + '\n' + bottomRow;

}

function offset(size) {
  return new Array(size).fill('<').join('');
}
