import { _ as _export_sfc } from "../app.mjs";
import { ssrRenderAttrs } from "vue/server-renderer";
import { mergeProps, useSSRContext } from "@vue/runtime-core";
import "@vue/shared";
const about_vue_vue_type_style_index_0_lang = "";
const block0 = {};
const _meta = { filename: "src/pages/about.vue", lastUpdated: new Date(1680042183211), href: "/about" }, _frontmatter = { title: "About" };
const _sfc_main = { inheritAttrs: false, ..._meta, ..._frontmatter, meta: _meta, frontmatter: _frontmatter, layoutName: "default", layoutFn: () => import("./default.67e3257c.mjs").then((m) => m.default) };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "about" }, _attrs))}><h1>This is an about page</h1></div>`);
}
if (typeof block0 === "function")
  block0(_sfc_main);
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  about as default
};
