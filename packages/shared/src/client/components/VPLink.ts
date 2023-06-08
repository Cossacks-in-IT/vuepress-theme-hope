import { withBase } from "@vuepress/client";
import { type FunctionalComponent, type VNode, h } from "vue";
import { type NavigationFailure, useRouter } from "vue-router";

import { guardEvent } from "../utils/index.js";

export interface VPLinkProps {
  to: string;
}

export const VPLink: FunctionalComponent<
  VPLinkProps,
  Record<never, never>,
  {
    default: () => string | VNode | (string | VNode)[];
  }
> = ({ to = "" }, { slots }) => {
  const router = useRouter();
  const navigate = (
    event: MouseEvent = {} as MouseEvent
  ): Promise<void | NavigationFailure> =>
    guardEvent(event) ? router.push(to).catch() : Promise.resolve();

  return h(
    "a",
    { class: "md-link", href: withBase(to), onClick: navigate },
    slots.default?.()
  );
};

VPLink.displayName = "VPLink";
