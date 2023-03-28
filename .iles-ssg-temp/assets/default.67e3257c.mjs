import { b as useRoute, c as useAppConfig, d as useVueRenderer, _ as _export_sfc } from "../app.mjs";
import { m as mapObject, a as asyncMapObject } from "./utils.49fcb051.mjs";
import { useSSRContext, defineComponent, h, defineAsyncComponent, createStaticVNode, createCommentVNode, mergeProps, resolveComponent, withCtx, createTextVNode } from "@vue/runtime-core";
import serialize from "@nuxt/devalue";
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import addSymbol from "vite-plugin-svg-sprite/runtime";
import "@vue/shared";
var findById = (id) => document.getElementById(id) || console.error(`Missing #${id}, could not mount island.`);
function hydrateNow(framework, component, id, props, slots) {
  const el = findById(id);
  if (el) {
    framework(component, id, el, props, slots);
    el.setAttribute("hydrated", "");
  }
}
async function resolveAndHydrate(frameworkFn, componentFn, id, props, slots) {
  const [framework, component] = await Promise.all([frameworkFn(), componentFn()]);
  hydrateNow(framework, component, id, props, slots);
}
function hydrateWhenIdle(framework, component, id, props, slots) {
  const whenIdle = window.requestIdleCallback || setTimeout;
  const cancelIdle = window.cancelIdleCallback || clearTimeout;
  const idleId = whenIdle(() => resolveAndHydrate(framework, component, id, props, slots));
  if (false)
    onDispose(id, () => cancelIdle(idleId));
}
function hydrateOnMediaQuery(framework, component, id, props, slots) {
  const mediaQuery = matchMedia(props._mediaQuery);
  delete props._mediaQuery;
  const onChange = (fn = null) => mediaQuery.onchange = fn;
  const hydrate = () => {
    onChange();
    resolveAndHydrate(framework, component, id, props, slots);
  };
  mediaQuery.matches ? hydrate() : onChange(hydrate);
  if (false)
    onDispose(id, onChange);
}
function hydrateWhenVisible(framework, component, id, props, slots) {
  const el = findById(id);
  if (el) {
    if (false)
      el.style.display = "initial";
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        stopObserver();
        if (false)
          el.style.display = "";
        resolveAndHydrate(framework, component, id, props, slots);
      }
    });
    const stopObserver = () => observer.disconnect();
    observer.observe(el);
    if (false)
      onDispose(id, stopObserver);
  }
}
var onDispose = (id, fn) => {
  var _a;
  return (_a = window.__ILE_DISPOSE__) == null ? void 0 : _a.set(id, fn);
};
"use strict";
function newHydrationId() {
  if (true) {
    const context = useSSRContext();
    context.hydrationSerialNumber || (context.hydrationSerialNumber = 1);
    return `ile-${context.hydrationSerialNumber++}`;
  } else if (false) {
    return window.__ILE_DEVTOOLS__.nextIslandId();
  }
}
var Hydrate;
(function(Hydrate2) {
  Hydrate2["WhenIdle"] = "client:idle";
  Hydrate2["OnLoad"] = "client:load";
  Hydrate2["MediaQuery"] = "client:media";
  Hydrate2["SkipPrerender"] = "client:only";
  Hydrate2["WhenVisible"] = "client:visible";
  Hydrate2["None"] = "client:none";
})(Hydrate || (Hydrate = {}));
const hydrationFns = {
  [Hydrate.WhenIdle]: hydrateWhenIdle.name,
  [Hydrate.OnLoad]: hydrateNow.name,
  [Hydrate.MediaQuery]: hydrateOnMediaQuery.name,
  [Hydrate.SkipPrerender]: hydrateNow.name,
  [Hydrate.WhenVisible]: hydrateWhenVisible.name,
  [Hydrate.None]: hydrateNow.name
};
function isEager(strategy) {
  return strategy === Hydrate.OnLoad || strategy === Hydrate.SkipPrerender || strategy === Hydrate.None;
}
function useIslandsForPath() {
  var _a, _b;
  const context = useSSRContext();
  if (!context)
    throw new Error("SSR context not found when rendering islands.");
  if (!context.islandsByPath)
    throw new Error("SSR context is missing islands.");
  const currentRoute = useRoute();
  return (_a = context.islandsByPath)[_b = currentRoute.path] || (_a[_b] = []);
}
function useRenderer(framework) {
  const context = useSSRContext();
  if (!context)
    throw new Error("SSR context not found when rendering islands.");
  if (!context.renderers)
    throw new Error("Island renderers are missing in SSR context.");
  return context.renderers[framework];
}
function trackIsland({ __ILE_DEVTOOLS__ } = window) {
  __ILE_DEVTOOLS__ == null ? void 0 : __ILE_DEVTOOLS__.addIslandToDevtools(this);
}
function untrackIsland({ __ILE_DEVTOOLS__, __ILE_DISPOSE__ } = window) {
  __ILE_DEVTOOLS__ == null ? void 0 : __ILE_DEVTOOLS__.removeIslandFromDevtools(this);
}
function disposeIsland({ __ILE_DEVTOOLS__, __ILE_DISPOSE__ } = window) {
  var _a;
  (_a = __ILE_DISPOSE__ == null ? void 0 : __ILE_DISPOSE__.get(this.id)) == null ? void 0 : _a();
}
function inspectMediaQuery(query) {
  if (!query.includes("(") && query.includes(": "))
    console.warn("You might need to add parenthesis to the following media query.\n	", query, "\n", "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#targeting_media_features");
  return query;
}
const _sfc_main$3 = defineComponent({
  name: "Island",
  inheritAttrs: false,
  props: {
    component: { type: [Object, Function, null], required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importFrom: { type: String, required: true },
    using: { type: String, default: void 0 },
    [Hydrate.WhenIdle]: { type: Boolean, default: false },
    [Hydrate.OnLoad]: { type: Boolean, default: false },
    [Hydrate.MediaQuery]: { type: [Boolean, String], default: false },
    [Hydrate.SkipPrerender]: { type: Boolean, default: false },
    [Hydrate.WhenVisible]: { type: Boolean, default: false },
    [Hydrate.None]: { type: Boolean, default: false }
  },
  setup(props, { attrs }) {
    let strategy = Object.values(Hydrate).find((s) => props[s]);
    if (!strategy) {
      console.warn("Unknown hydration strategy, falling back to client:load. Received:", { ...attrs });
      strategy = Hydrate.OnLoad;
    }
    const ext = props.importFrom.split(".")[1];
    const appConfig = useAppConfig();
    const framework = props.using || ext === "svelte" && "svelte" || (ext === "js" || ext === "ts") && "vanilla" || (ext === "jsx" || ext === "tsx") && appConfig.jsx || "vue";
    return {
      id: newHydrationId(),
      strategy,
      framework,
      appConfig,
      islandsForPath: strategy !== Hydrate.None ? useIslandsForPath() : void 0,
      renderVNodes: useVueRenderer(),
      prerender: true ? useRenderer(framework) : void 0
    };
  },
  mounted: trackIsland,
  beforeUpdate: disposeIsland,
  updated: trackIsland,
  beforeUnmount: untrackIsland,
  unmounted: disposeIsland,
  render() {
    const isSSR = true;
    const props = { ...this.$attrs };
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = inspectMediaQuery(this.$props[Hydrate.MediaQuery]);
    const { _, ...slots } = this.$slots;
    const slotVNodes = mapObject(slots, (slotFn) => slotFn == null ? void 0 : slotFn());
    const hydrationPkg = `${isSSR ? "" : "/@id/"}@islands/hydration`;
    let renderedSlots;
    const renderSlots = async () => renderedSlots || (renderedSlots = await asyncMapObject(slotVNodes, this.renderVNodes));
    const renderScript = async () => {
      const slots2 = await renderSlots();
      const componentPath = this.importFrom.replace(this.appConfig.root, "");
      const frameworkPath = `${hydrationPkg}/${this.framework}`;
      return `import { ${hydrationFns[this.strategy]} as hydrate } from '${hydrationPkg}'
${isEager(this.strategy) ? `import framework from '${frameworkPath}'
import { ${this.importName} as component } from '${componentPath}'` : `const framework = async () => (await import('${frameworkPath}')).default
const component = async () => (await import('${componentPath}')).${this.importName}`}
hydrate(framework, component, '${this.id}', ${serialize(props)}, ${serialize(slots2)})
  `;
    };
    const renderPlaceholder = async () => {
      const placeholder = `ISLAND_HYDRATION_PLACEHOLDER_${this.id}`;
      const script = await renderScript();
      const componentPath = this.importFrom;
      this.islandsForPath.push({ id: this.id, script, componentPath, placeholder });
      return placeholder;
    };
    const prerenderIsland = () => {
      if (this.strategy === Hydrate.SkipPrerender)
        return void 0;
      if (this.framework === "vanilla")
        return void 0;
      if (this.framework === "vue") {
        const vnode = h(this.component, this.$attrs, this.$slots);
        return isSSR ? vnode : h(defineAsyncComponent(async () => createStaticVNode(await this.renderVNodes(vnode), void 0)));
      }
      const prerender = this.prerender;
      if (!prerender)
        return void 0;
      return h(defineAsyncComponent(async () => {
        const slots2 = await renderSlots();
        const result = await prerender(this.component, this.$attrs, slots2, this.id);
        return createStaticVNode(result, void 0);
      }));
    };
    const ileAttrs = { id: this.id };
    if (this.$attrs.class)
      ileAttrs.class = this.$attrs.class;
    const ileRoot = h("ile-root", ileAttrs, prerenderIsland());
    if (isSSR && this.strategy === Hydrate.None)
      return ileRoot;
    return [
      ileRoot,
      h(
        defineAsyncComponent(async () => isSSR ? createCommentVNode(await renderPlaceholder()) : h("script", { async: true, type: "module", innerHTML: await renderScript() }))
      )
    ];
  }
});
const Island_vue_vue_type_style_index_0_lang = "";
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/iles@0.8.7/node_modules/iles/dist/client/app/components/Island.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    target: "_blank",
    href: "https://v3.vuejs.org/"
  }, _attrs))}> Vue 3 `);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</a>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FrameworkLink.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __ile_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HelloWorld",
  __ssrInlineRender: true,
  props: {
    msg: null
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Island = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "greetings" }, _attrs))} data-v-bdf93990><h1 class="green" data-v-bdf93990>${ssrInterpolate(__props.msg)}</h1><h3 data-v-bdf93990> You\u2019ve successfully created a project with <a target="_blank" href="https://iles-docs.netlify.app/" data-v-bdf93990>\xEEles</a> + <a target="_blank" href="https://vitejs.dev/" data-v-bdf93990>Vite</a> + `);
      _push(ssrRenderComponent(_component_Island, {
        component: __ile_components_0,
        componentName: "FrameworkLink",
        importName: "default",
        importFrom: "/home/jonathanl/Code/iles-vite-plugin-svg-sprite-repro/src/components/FrameworkLink.vue",
        "client:none": ""
      }, null, _parent));
      _push(`. What&#39;s next? </h3></div>`);
    };
  }
});
const HelloWorld_vue_vue_type_style_index_0_scoped_bdf93990_lang = "";
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/HelloWorld.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-bdf93990"]]);
addSymbol('<symbol xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 128 128" id="icon-logo-d25648"><path d="M13.8 101.95c-1.95 12.37 16.51 22.5 52.26 22.5s48.99-13.25 48.26-21.41c-.73-8.18-15.6-21.23-52.98-19.96-37.37 1.27-46.45 11.98-47.54 18.87z" fill="#179cf5" /><path d="M26.68 96.9c.35.7 3.96 1.18 5.69 2.85 3.05 2.94 3.39 5.12 7.27 6.3 3.87 1.17 6.99-.81 11.56-.14 4.71.69 6.71 3.6 11.62 3.87 5.63.32 5.66-3.61 12-4.08 6.34-.47 7.21 1.68 12.33.23 5.04-1.43 5.52-4.34 8.22-6.34s4.59-2.48 4.59-2.48-7.65-16.87-30.53-17.95C44.64 78 26.68 96.9 26.68 96.9z" fill="#f6c973" /><path d="M40.24 94.34s5.3.3 10.98-.95 10.92-3.21 11.54-2.02c.56 1.07-4.81 5.19-4.81 5.19s2.5 1.81 8.05 1.22 9.58-2.71 11.56-3.96 5.15-3.18 9.38-4.24 6.7-.69 6.7-.69-5.16-5.42-10.27-6.76c-11.09-2.91-14.11-1.99-21.22.09-11.39 3.33-21.91 12.12-21.91 12.12z" fill="#eda052" /><path d="m71.58 37.18-7.22 4.83s5.74 6.67 7.4 15.87c1.07 5.93 1.91 11.21 1.21 16.24-.29 2.05-2.27 6.19-2.84 7.58-.57 1.39-1.39 4.67 1.15 5.33s10.82.9 12.04.74c1.23-.16 2.68-1.06 2.02-4.03-.41-1.85-1.11-7.61-1.52-11.54-.41-3.93-.66-11.5-4.08-20.79-3.33-9.07-8.16-14.23-8.16-14.23z" fill="#dc8124" /><path d="M78.22 77.07c3.73.21 6.1-.5 6.1-.5l.51 3.78s-2.28.64-6.58.38c-3.75-.23-7.14-1.26-7.14-1.26l1.4-3.57c-.01-.01 1.95.95 5.71 1.17zm-5.15-10.25s.07 1.05.11 1.72c.03.67.05 1.7.05 1.7s2.82.33 5.05.24c3.65-.15 5.29-1.02 5.29-1.02s-.07-.81-.17-1.77-.21-1.76-.21-1.76-1.79.88-5.54 1.13c-2.7.16-4.58-.24-4.58-.24zm-1.44-9.57s1.71.35 4.9-.34c3.1-.67 4.43-1.85 4.43-1.85s.29.91.46 1.6c.16.65.41 1.6.41 1.6s-1.25 1.23-4.65 1.9c-3.33.66-4.99.21-4.99.21s-.16-.89-.27-1.55c-.12-.77-.29-1.57-.29-1.57z" fill="#c0711f" /><path d="M69.88 51.37s1.58.11 4.65-1.05c2.68-1.01 3.83-2.36 3.83-2.36l-3.77-8.28-9.04 3.28 4.33 8.41z" fill="#a2672b" /><path d="m70.39 41.08 15.24 5.75s.71-2.02 1.06-3.68c.23-1.1.44-3.02.91-2.99.78.06 1.25 1.33 1.28 3.13.03 1.55-.38 4.27-.38 4.27l3.24.99s.73-1.52 1.2-3.45c.49-2.02.18-3.27.69-3.27.87 0 1.51 1.62 1.43 4.1-.06 1.94-.5 3.54-.4 3.61.16.13 1.92.42 3.35.82 1.43.4 2.29.51 2.29.51s2.32-11.02-4.85-15.78c-8.26-5.48-18.6-1.32-18.6-1.32l6.69-5.6s-.37-1.17-1.45-2.89c-.6-.96-1.61-2.05-1.85-2.73-.17-.48 1.28-.64 3.21.52 1.54.93 3.68 2.8 3.72 2.83l1.74-1.27s-.12-1.45-.8-2.69c-.57-1.05-1.21-2.15-.96-2.29.51-.29 2 .1 3.01 1.08.87.85 1.49 2.13 1.49 2.13l5.2-3.32s-3.6-5.65-11.42-5.37c-7.82.29-11.21 4.55-12.52 6.04-1.31 1.48-3.39 4.88-3.39 4.88l.74-9.1s-.47-.62-1.76-1.02c-1.28-.4-2.43-.13-2.45-.3-.09-.62.98-1.69 2.74-1.89 1.03-.12 1.99.04 1.99.04l.84-8.77s-9.55.19-12.58 8.8c-2.6 7.4 2.21 14.19 1.33 14.85-.75.56-6.95-6.24-16.18-4.06-10.13 2.39-12.9 13.08-12.32 13.08 1.55 0 6.27.22 6.55 0 .14-.11.56-1.42 1.48-2.83.92-1.41 3.29-3.47 4.22-3.08.48.2-.18 1.05-.8 2.57-.62 1.57-1.21 3.62-1.21 3.62l4.34-.04s1.48-5.01 3.25-5.38c.76-.16.07 1.24-.12 2.49-.19 1.29-.08 3.01-.08 3.01l6.78.4s-8.51.33-14.18 5.5c-5.87 5.35-6.5 10.79-6.05 15.51.32 3.36 1 5.69 1.32 6.05.25.29 4.51-4.53 4.68-4.93.17-.4-.29-2.78-.29-5.06s.51-3.43.97-3.48c.46-.06.34 1.6.69 3.03.36 1.49.91 2.74 1.14 2.85.23.11 2.77-3.2 2.77-3.2s-.28-1.63-.43-2.93c-.15-1.31.14-2.84.51-3.1.41-.29.6 1.33 1.08 2.61.39 1.02.71 1.58.92 1.85l4.51-4.26s-3.46 6.29-2.93 12.75c.59 7.23 5.02 9.14 5.3 9.09.29-.06 3.52-7.1 3.52-7.1s-1.01-1.24-1.89-2.89c-1.11-2.08-1.05-3.95-.64-4.21.58-.37 1.43 1.94 2.28 2.97.86 1.03 1.43 1.45 1.61 1.45s2.53-4.86 2.53-4.86-.7-.81-1.25-1.65c-.46-.71-.87-1.94-.48-2.67.42-.39.84.62 1.49 1.15.64.53 1.24 1.08 1.24 1.08l5.69-11.95z" fill="#728137" /><path d="M71.59 44.78c.33-.22.98-4.63 1.3-6.83.28-1.99.98-4.95-.53-5.25-1.04-.2-1.47 1.27-1.8 2.84-.3 1.4-.74 3.31-.74 3.31s-1.34-2.57-2.24-4.14c-.65-1.13-2.06-3.52-3.18-2.81-1.29.82.11 3.46.9 4.91.79 1.45 1.68 3.15 1.68 3.15s-2.37-.81-3.75-1.24c-1.51-.47-3.54-.88-3.82-.07-.49 1.42 1.38 2.13 5 3.61 3.6 1.48 6.63 2.88 7.18 2.52z" fill="#bdcf47" /><path d="M61.19 76.63c-2.49.31-4.37 2.4-3.81 5.64s3.89 3.73 5.75 3.42c2.24-.38 4.64-2.89 3.07-6.47-1.05-2.41-3.48-2.78-5.01-2.59z" fill="#a2672b" /><path d="M17.55 100.12c-.76-.6-2.57 2.35.07 5.7.88 1.12 1.58 2.79 3.23 3.96 1.54 1.09 2.66 1.14 4.85 2.76 1.08.8 3.28 1.67 3.86 1.58 1.29-.19 1.52-.33 1.43-.68-.14-.51-1.85-1.12-3.17-2.29-1.41-1.25-2-3.39-3.54-4.56-1.87-1.43-2.75-.83-5.07-3.28-1.08-1.13-1.56-3.11-1.66-3.19zm81.06 13.68c.33.61 5.05-2.66 7.12-3.76 2.07-1.09 5.26-1.41 6.13-5.18.56-2.45-1.28-4.86-1.82-4.8-.55.06-.82 2.35-2.01 3.89-1.64 2.13-3.77 2.49-5.71 4.31-1.55 1.46-4.14 4.75-3.71 5.54z" fill="#0fcaff" /><path d="M24.53 93.38c.59.74-1.58 2.37-1.22 3.71.85 2.49 2.19 1.82 5.53 4.44 3.22 2.51 2.8 3.83 5.29 5.83 2.01 1.62 4.74 2.92 8.81 2.61s5.19-.55 8.11-.19c4.93.62 4.72 2.56 9.88 3.77 2.33.55 4.62-.18 6.87-1.52 2.03-1.21 4.74-2.67 8.69-2.73 3.95-.06 8.99 1.23 13.35-.49 3.56-1.41 4.4-3.64 7.01-6.07 2.61-2.43 5.94-2.66 6.56-4.74.73-2.43-2.37-3.77-2.86-4.31-.49-.55-.43-1.52.67-1.46s6.5 2.25 6.14 6.32c-.28 3.11-2.92 4.19-4.38 4.92-.92.46-3.1 1.52-5.41 4.44-2.31 2.92-3.44 4.65-6.56 5.65-3.52 1.12-7.54 1.03-12.15.79-3.76-.2-6.96.71-9.54 2.01-2.67 1.34-5.85 2.1-8.63 1.64-4.44-.73-6.02-2.98-10.21-3.71-4.01-.97-7.23 1.46-13.73-.67-5.02-1.64-6.44-4.68-7.78-6.2s-2.31-2.98-5.47-4.38c-3.16-1.4-3.77-3.46-3.71-4.8.11-2.31 1.82-3.59 2.49-4.19.67-.6 2.01-.97 2.25-.67z" fill="#76f8ff" /></symbol>', "icon-logo-d25648");
const _imports_0 = "icon-logo-d25648";
const default_vue_vue_type_style_index_0_lang = "";
const _sfc_main = { name: "DefaultLayout" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_HelloWorld = __unplugin_components_0;
  const _component_router_link = resolveComponent("router-link");
  _push(`<!--[--><header><img alt="Vue logo" class="logo"${ssrRenderAttr("src", _imports_0)} width="125" height="125"><div class="wrapper">`);
  _push(ssrRenderComponent(_component_HelloWorld, {
    msg: _ctx.$frontmatter.title
  }, null, _parent));
  _push(`<div id="nav">`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_router_link, { to: "/about" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`About`);
      } else {
        return [
          createTextVNode("About")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></header>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  _default as default
};
