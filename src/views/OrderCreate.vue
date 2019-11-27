<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row" v-if="error">
        <div class="col-md-12">
          <div class="alert alert-danger">
            <span>{{ error.message }}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-xs-12">
          <form @submit.prevent="submit()">
            <fieldset :disabled="isLoading">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="order.description"
                  placeholder="Add a comment about this order (optional)"
                />
              </fieldset>
              <fieldset class="form-group">
                <codemirror
                  ref="myCm"
                  :value="order.content"
                  :options="cmOptions"
                  @ready="onCmReady"
                  @focus="onCmFocus"
                  @input="onCmCodeChange"
                >
                </codemirror>
              </fieldset>
            </fieldset>
            <button
              :disabled="isLoading"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
            >
              Publish Order
            </button>
          </form>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-10 col-xs-12">
          <h3>Sample :</h3>
          <br />
          <pre>{{ sampleOrder }}</pre>
        </div>
        <div class="col-md-2 col-xs-12">
          <button class="btn btn-primary" @click="useSample(sampleOrder)">
            Use sample
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-code-textarea {
  font-family: Menlo, Monaco, Consolas, liberation mono, courier new, monospace;
}
</style>
<style>
.CodeMirror {
  height: 500px !important;
}
</style>

<script>
import { order1 } from "@/common/order.samples";
import OrderService from "@/common/order.service";

import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

// language
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/yaml/yaml.js";
// theme css
import "codemirror/theme/monokai.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";
// hint
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

// lint
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
// import "codemirror/addon/lint/javascript-lint.js";
// import "codemirror/addon/lint/yaml-lint.js";
import "@/common/editor/addon/order-yml-lint";

const optionsDemo = {
  tabSize: 2,
  styleActiveLine: false,
  lineNumbers: true,
  styleSelectedText: false,
  size: {
    height: 1000
  },
  line: true,
  foldGutter: true,
  gutters: [
    "CodeMirror-linenumbers",
    "CodeMirror-foldgutter",
    "CodeMirror-lint-markers"
  ],
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
  // mode: "text/javascript",
  mode: "text/x-yaml",
  // hint.js options
  hintOptions: {
    // 当匹配只有一项的时候是否自动补全
    completeSingle: false
  },
  //快捷键 可提供三种模式 sublime、emacs、vim
  keyMap: "sublime",
  matchBrackets: true,
  showCursorWhenSelecting: true,
  theme: "monokai",
  extraKeys: { Ctrl: "autocomplete" },
  lint: true
};

// eslint-disable-next-line no-unused-vars
const myOptions = {
  // codemirror options
  tabSize: 4,
  mode: "text/javascript",
  theme: "base16-dark",
  lineNumbers: true,
  line: true
  // more codemirror options, 更多 codemirror 的高级配置...
};

export default {
  components: {
    codemirror
  },
  data: () => {
    return {
      order: {},
      code: "",
      isLoading: false,
      error: null,
      sampleOrder: order1,
      cmOptions: optionsDemo
    };
  },
  methods: {
    submit() {
      console.log("submit", Object.assign({}, this.order));
      OrderService.create(this._data.order.content)
        .then(order => {
          console.log(order);
          alert("success");
          this.$router.push("/");
        })
        .catch(err => (console.log(err), (this._data.error = err)));
    },
    useSample(sample) {
      this._data.order.content = sample;
      this._data.code = sample;
      this.$forceUpdate();
    },
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focus!", cm);
    },
    // eslint-disable-next-line no-unused-vars
    onCmCodeChange(newCode) {
      // console.log("this is new code", newCode);
      this._data.order.content = newCode;
    }
  }
};
</script>
