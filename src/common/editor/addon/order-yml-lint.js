import CodeMirror from "codemirror";
import jsyaml from "js-yaml";

import Joi from "@hapi/joi";

const schema = Joi.object({
  action: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
}).unknown(true);

// https://hapi.dev/family/joi/?v=16.1.8
const validateSchema = obj => {
  const validation = schema.validate(obj);

  if (validation.error) {
    throw validation.error;
  }
};

CodeMirror.registerHelper("lint", "yaml", function(text, options) {
  console.log("helper", text, Object.assign({}, options));
  const found = [];
  try {
    const docs = jsyaml.loadAll(text); // (1)
    console.log("doc", docs);
    if (typeof docs[0] === "object") {
      // doc is a string when text contains only one work
      validateSchema(docs[0]);
    } else {
      validateSchema({});
    }
  } catch (e) {
    console.log("validator error", e);
    let loc = e.mark,
      from = loc ? CodeMirror.Pos(loc.line, loc.column) : CodeMirror.Pos(0, 0),
      to = from;
    found.push({ from: from, to: to, message: e.message });
  }

  // if (!found.length) {
  //   found.push({
  //     from: CodeMirror.Pos(2, 0),
  //     to: CodeMirror.Pos(2, 10),
  //     message: "This is a sample"
  //   });
  // }
  console.log("found", found);
  return found;
});

/*
(1)
js-yaml YAMLException doesn't always provide an accurate lineno
e.g., when there are multiple yaml docs
---
---
foo:bar
*/
