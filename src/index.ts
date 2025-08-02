//TODO support commonJs in package.json

import BooleanValidator from "./validators/booleanValidator";
import numberValidator from "./validators/numberValidator";
import objectValidator from "./validators/objectValidator";
import stringValidator from "./validators/StringValidator";

export {
  BooleanValidator as boolean,
  numberValidator as number,
  objectValidator as object,
  stringValidator as string,
};
