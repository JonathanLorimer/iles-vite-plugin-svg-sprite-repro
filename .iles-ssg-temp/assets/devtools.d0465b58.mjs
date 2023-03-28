import { u as usePage, s as setupDevtoolsPlugin } from "../app.mjs";
import { g as getComponentName } from "./utils.49fcb051.mjs";
import { reactive, computed } from "@vue/runtime-core";
import "@vue/shared";
import "vue/server-renderer";
import "@nuxt/devalue";
const ISLAND_TYPE = "Islands \u{1F3DD}";
const componentStateTypes = [ISLAND_TYPE];
const INSPECTOR_ID = "iles";
const HYDRATION_LAYER_ID = "iles:hydration";
let lastUsedIslandId = 0;
const islandsById = reactive({});
const islands = computed(() => Object.values(islandsById));
const strategyLabels = {
  "client:idle": "whenIdle",
  "client:load": "instant",
  "client:media": "onMediaQuery",
  "client:only": "noPrerender",
  "client:visible": "whenVisible",
  "client:none": "static"
};
const frameworkColors = {
  preact: { backgroundColor: 6765240, textColor: 16777215 },
  solid: { backgroundColor: 4483998, textColor: 16777215 },
  svelte: { backgroundColor: 16727552, textColor: 16777215 },
  vue: { backgroundColor: 4372867, textColor: 16777215 }
};
let devtoolsApi;
let appConfig;
let page = {};
let route = {};
let meta = {};
let frontmatter = {};
let props = {};
let site = {};
const devtools = {
  updateIslandsInspector() {
    devtoolsApi == null ? void 0 : devtoolsApi.sendInspectorTree(INSPECTOR_ID);
  },
  addIslandToDevtools(island) {
    islandsById[island.id] = island;
    devtools.updateIslandsInspector();
    devtoolsApi == null ? void 0 : devtoolsApi.selectInspectorNode(INSPECTOR_ID, route == null ? void 0 : route.path);
  },
  removeIslandFromDevtools(island) {
    delete islandsById[island.id];
    while (lastUsedIslandId > 0 && !islandsById[`ile-${lastUsedIslandId}`])
      lastUsedIslandId -= 1;
    devtools.updateIslandsInspector();
  },
  nextIslandId() {
    return `ile-${++lastUsedIslandId}`;
  },
  onHydration({ id, ...event }) {
    const time = Date.now();
    const island = islandsById[id];
    if (!island)
      return;
    const hydrated = getStrategy(island);
    const mediaQuery = getMediaQuery(island);
    const component = island.componentName;
    const data = { event, hydrated, ...mediaQuery ? { mediaQuery } : {} };
    devtoolsApi == null ? void 0 : devtoolsApi.addTimelineEvent({
      layerId: HYDRATION_LAYER_ID,
      event: { time, title: component, subtitle: hydrated, data }
    });
    if ((appConfig == null ? void 0 : appConfig.debug) === "log") {
      const { el, slots } = event;
      console.info(`\u{1F3DD} hydrated ${component}`, el, slots);
    }
  }
};
window.__ILE_DEVTOOLS__ = devtools;
function installDevtools(app, config) {
  appConfig = config;
  const pageData = usePage(app);
  route = pageData.route;
  page = pageData.page;
  frontmatter = pageData.frontmatter;
  props = pageData.props;
  meta = pageData.meta;
  site = pageData.site;
  setupDevtoolsPlugin({
    id: "com.maximomussini.iles",
    label: ISLAND_TYPE,
    logo: "https://iles-docs.netlify.app/favicon.svg",
    packageName: "iles",
    homepage: "https://github.com/ElMassimo/iles",
    componentStateTypes,
    app
  }, (api) => {
    devtoolsApi = api;
    api.addInspector({
      id: INSPECTOR_ID,
      label: ISLAND_TYPE,
      icon: "waves",
      treeFilterPlaceholder: "Search islands"
    });
    api.addTimelineLayer({
      id: HYDRATION_LAYER_ID,
      color: 16750671,
      label: "Hydration \u{1F3DD}"
    });
    api.on.inspectComponent(({ componentInstance, instanceData }) => {
      const island = findIsland(componentInstance == null ? void 0 : componentInstance.proxy);
      if (!island)
        return;
      instanceData.state.push({ type: ISLAND_TYPE, key: "within", value: island });
    });
    api.on.getInspectorTree(async (payload) => {
      var _a, _b;
      if (payload.app !== app || payload.inspectorId !== INSPECTOR_ID)
        return;
      const userFilter = ((_a = payload.filter) == null ? void 0 : _a.toLowerCase()) || "";
      const islandNodes = islands.value.filter((island) => island.id.includes(userFilter) || island.componentName.toLowerCase().includes(userFilter)).map((island) => ({
        id: island.id,
        label: island.componentName,
        tags: [
          { label: island.id, textColor: 0, ...frameworkColors[island.framework] },
          { label: getStrategy(island), textColor: 0, backgroundColor: 2282478 },
          getMediaQuery(island) && { label: getMediaQuery(island), textColor: 0, backgroundColor: 16486972 }
        ].filter((x) => x)
      }));
      payload.rootNodes = [{
        id: meta.href,
        label: getComponentName(page.value),
        children: islandNodes,
        tags: [
          { label: (_b = page.value.layoutName) != null ? _b : "no layout", textColor: 0, backgroundColor: 4372867 }
        ]
      }];
    });
    api.on.getInspectorState((payload, ctx) => {
      var _a, _b;
      if (payload.app !== app || payload.inspectorId !== INSPECTOR_ID)
        return;
      if (payload.nodeId === route.path) {
        payload.state = {
          props: [
            { key: "component", value: page.value },
            { key: "layout", value: page.value.layoutName },
            { key: "frontmatter", value: frontmatter },
            { key: "meta", value: meta },
            { key: "props", value: props.value },
            { key: "site", value: site }
          ].filter((x) => x)
        };
        return;
      }
      const island = islandsById[payload.nodeId];
      if (!island)
        return;
      const ileRoot = (_a = island.$el) == null ? void 0 : _a.nextSibling;
      payload.state = {
        props: [
          { key: "component", value: island.component },
          { key: "el", value: ((_b = ileRoot == null ? void 0 : ileRoot.children) == null ? void 0 : _b[0]) || ileRoot },
          { key: "strategy", value: getStrategy(island) },
          getMediaQuery(island) && { key: "mediaQuery", value: getMediaQuery(island) },
          { key: "framework", value: island.framework },
          { key: "props", value: island.$attrs },
          { key: "importName", value: island.importName },
          { key: "importFrom", value: island.importFrom.replace(island.appConfig.root, "") }
        ].filter((x) => x)
      };
    });
  });
}
function findIsland(component) {
  var _a;
  if (!component)
    return null;
  if ((_a = component.strategy) == null ? void 0 : _a.startsWith("client:"))
    return component;
  return findIsland(component.$parent);
}
function getStrategy(island) {
  return strategyLabels[island.strategy];
}
function getMediaQuery(island) {
  if (island.strategy === "client:media")
    return island["client:media"];
}
export {
  installDevtools
};
