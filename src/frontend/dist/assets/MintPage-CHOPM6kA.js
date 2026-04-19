var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { S as Subscribable, s as shallowEqualObjects, h as hashKey, g as getDefaultState, n as notifyManager, u as useQueryClient, r as reactExports, a as noop, b as shouldThrowError, j as jsxRuntimeExports, c as cn, d as useWallet, e as createActor } from "./index-DMW22NCG.js";
import { c as createLucideIcon, a as createSlot, C as CircleAlert, u as useActor, L as Layout, b as Card, d as CardContent, B as Button, e as CardHeader, f as CardTitle, g as CardDescription, h as LoaderCircle } from "./Layout-IDsHCkmV.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a2;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a2 = props.onMouseDown) == null ? void 0 : _a2.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_NAME_LENGTH = 100;
const MAX_DESC_LENGTH = 500;
const BACKEND_CANISTER_ID = "zqdrq-zqaaa-aaaam-afzhq-cai";
function MintPage() {
  var _a2;
  const { walletType, plugActor, principal } = useWallet();
  const { actor: iiActor } = useActor(createActor);
  const queryClient = useQueryClient();
  const actor = walletType === "plug" ? plugActor : iiActor;
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [success, setSuccess] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const validate = () => {
    const next = {};
    if (!imageFile) next.image = "Please select an image to mint.";
    if (!name.trim()) next.name = "NFT name is required.";
    else if (name.length > MAX_NAME_LENGTH)
      next.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    if (description.length > MAX_DESC_LENGTH)
      next.description = `Description must be ${MAX_DESC_LENGTH} characters or fewer.`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleFileChange = reactExports.useCallback(
    (file) => {
      if (!file) return;
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setErrors((e) => ({
          ...e,
          image: "Only PNG and JPG images are supported."
        }));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrors((e) => ({
          ...e,
          image: "Image must be 5MB or smaller."
        }));
        return;
      }
      setErrors((e) => ({ ...e, image: void 0 }));
      setImageFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl]
  );
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0] ?? null;
      handleFileChange(file);
    },
    [handleFileChange]
  );
  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
    setErrors((e) => ({ ...e, image: void 0 }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const mintMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !imageFile) throw new Error("Not ready to mint.");
      console.log(
        `[Mint] Submitting mint as principal: ${principal ?? "unknown"} via ${walletType ?? "unknown"} wallet`
      );
      const arrayBuffer = await imageFile.arrayBuffer();
      const imageBytes = new Uint8Array(arrayBuffer);
      const result = await actor.mint(
        name.trim(),
        description.trim(),
        imageBytes
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (tokenId) => {
      setSuccess({
        tokenId,
        name: name.trim(),
        previewUrl: previewUrl ?? ""
      });
      queryClient.invalidateQueries({ queryKey: ["nfts-by-owner"] });
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mintMutation.mutate();
  };
  const handleMintAnother = () => {
    removeImage();
    setName("");
    setDescription("");
    setErrors({});
    setSuccess(null);
    mintMutation.reset();
  };
  const dashboardUrl = `https://dashboard.internetcomputer.org/canister/${BACKEND_CANISTER_ID}`;
  const showSuccess = success !== null;
  const successName = (success == null ? void 0 : success.name) ?? "";
  const successPreviewUrl = (success == null ? void 0 : success.previewUrl) ?? "";
  const successTokenId = ((_a2 = success == null ? void 0 : success.tokenId) == null ? void 0 : _a2.toString()) ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-display font-medium mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
        "ICP NFT Minting"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: "Create NFT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-sm", children: "Upload an image, give it a name, and mint it on the Internet Computer." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": !showSuccess,
        style: { display: showSuccess ? "block" : "none" },
        "data-ocid": "mint.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border border-border card-shadow-elevated overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-8 pb-8 flex flex-col items-center text-center gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "NFT Minted!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mx-auto", children: "Your NFT has been successfully minted and added to your collection on the Internet Computer." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden border border-border aspect-square bg-muted", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { display: successPreviewUrl ? "block" : "none" },
                    className: "w-full h-full",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: successPreviewUrl || "",
                        alt: successName,
                        className: "w-full h-full object-cover",
                        "data-ocid": "mint.success_image_preview"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { display: successPreviewUrl ? "none" : "flex" },
                    className: "w-full h-full items-center justify-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-10 h-10 text-muted-foreground opacity-40" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-semibold text-foreground text-base",
                  "data-ocid": "mint.success_nft_name",
                  children: successName
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-4 py-2.5",
                "data-ocid": "mint.success_token_id",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: "Token ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground", children: [
                    "#",
                    successTokenId
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  variant: "outline",
                  className: "flex-1 font-display transition-smooth",
                  "data-ocid": "mint.dashboard_link",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: dashboardUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 mr-1.5" }),
                        "View on Dashboard"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: handleMintAnother,
                  className: "flex-1 font-display transition-smooth",
                  "data-ocid": "mint.mint_another_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-1.5" }),
                    "Mint Another"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": showSuccess,
        style: { display: showSuccess ? "none" : "block" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "bg-card border border-border card-shadow-elevated",
            "data-ocid": "mint.form_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "NFT Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Fill in the details below to mint your NFT on chain." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", noValidate: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "font-display font-medium text-sm", children: [
                    "Image",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": true, children: "*" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: { display: previewUrl ? "block" : "none" },
                        className: "relative group rounded-xl overflow-hidden border border-border aspect-video bg-muted",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: previewUrl || "",
                              alt: "NFT preview",
                              className: "w-full h-full object-contain",
                              "data-ocid": "mint.image_preview"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "aria-label": "Remove image",
                              "data-ocid": "mint.remove_image_button",
                              onClick: removeImage,
                              className: "absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/10 hover:text-destructive",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: { display: previewUrl ? "none" : "block" },
                        onDrop: handleDrop,
                        onDragOver: (e) => e.preventDefault(),
                        "data-ocid": "mint.image_dropzone",
                        className: `w-full rounded-xl border-2 border-dashed aspect-video ${errors.image ? "border-destructive/50 bg-destructive/5" : "border-border bg-muted/30"}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              var _a3;
                              return (_a3 = fileInputRef.current) == null ? void 0 : _a3.click();
                            },
                            className: "w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer transition-smooth hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-6 h-6 text-primary" }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-medium text-foreground", children: "Click or drag to upload" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "PNG or JPG · Max 5MB" })
                              ] })
                            ]
                          }
                        )
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "image/png,image/jpeg",
                      className: "hidden",
                      "data-ocid": "mint.image_input",
                      onChange: (e) => {
                        var _a3;
                        return handleFileChange(((_a3 = e.target.files) == null ? void 0 : _a3[0]) ?? null);
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: errors.image ? "block" : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FieldError,
                    {
                      message: errors.image || "",
                      id: "mint.image_field_error"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "nft-name",
                        className: "font-display font-medium text-sm",
                        children: [
                          "Name",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", "aria-hidden": true, children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      name.length,
                      "/",
                      MAX_NAME_LENGTH
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "nft-name",
                      "data-ocid": "mint.name_input",
                      placeholder: "My Awesome NFT",
                      value: name,
                      maxLength: MAX_NAME_LENGTH,
                      onChange: (e) => setName(e.target.value),
                      onBlur: () => {
                        if (!name.trim())
                          setErrors((x) => ({
                            ...x,
                            name: "NFT name is required."
                          }));
                        else setErrors((x) => ({ ...x, name: void 0 }));
                      },
                      "aria-invalid": !!errors.name,
                      "aria-describedby": errors.name ? "name-error" : void 0,
                      className: errors.name ? "border-destructive/50" : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: errors.name ? "block" : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FieldError,
                    {
                      message: errors.name || "",
                      id: "mint.name_field_error"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "nft-desc",
                        className: "font-display font-medium text-sm",
                        children: [
                          "Description",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-normal", children: "(optional)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      description.length,
                      "/",
                      MAX_DESC_LENGTH
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "nft-desc",
                      "data-ocid": "mint.description_textarea",
                      placeholder: "Describe your NFT...",
                      value: description,
                      maxLength: MAX_DESC_LENGTH,
                      rows: 3,
                      onChange: (e) => setDescription(e.target.value),
                      onBlur: () => {
                        if (description.length > MAX_DESC_LENGTH)
                          setErrors((x) => ({
                            ...x,
                            description: `Max ${MAX_DESC_LENGTH} characters.`
                          }));
                        else
                          setErrors((x) => ({
                            ...x,
                            description: void 0
                          }));
                      },
                      "aria-invalid": !!errors.description,
                      className: errors.description ? "border-destructive/50" : ""
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: { display: errors.description ? "block" : "none" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FieldError,
                        {
                          message: errors.description || "",
                          id: "mint.description_field_error"
                        }
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { display: mintMutation.isError ? "block" : "none" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "mint.error_state",
                        className: "flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: mintMutation.error instanceof Error ? mintMutation.error.message : "Minting failed. Please try again." })
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "submit",
                    "data-ocid": "mint.submit_button",
                    disabled: mintMutation.isPending,
                    className: "w-full font-display font-semibold transition-smooth",
                    size: "lg",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            display: mintMutation.isPending ? "flex" : "none"
                          },
                          className: "items-center justify-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                            "Minting…"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            display: mintMutation.isPending ? "none" : "flex"
                          },
                          className: "items-center justify-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                            "Mint NFT"
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      display: mintMutation.isPending ? "block" : "none"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-center text-xs text-muted-foreground",
                        "data-ocid": "mint.loading_state",
                        children: "Submitting to the Internet Computer — this may take a few seconds."
                      }
                    )
                  }
                )
              ] }) })
            ]
          }
        )
      }
    )
  ] }) }) });
}
function FieldError({ message, id }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "p",
    {
      id,
      "data-ocid": id,
      role: "alert",
      className: "flex items-center gap-1.5 text-xs text-destructive mt-1",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }),
        message
      ]
    }
  );
}
export {
  FieldError,
  MintPage
};
