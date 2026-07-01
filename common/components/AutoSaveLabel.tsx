import { Component, template } from "uix/components/Component.ts";
import { currentLocale, t } from "common/i18n/i18n.ts";

@template(function () {
    return <div aria-live="polite">{always(() => t("auto_save"))}</div>;
})
export class AutoSaveLabel extends Component {}
