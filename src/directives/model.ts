import { assert } from "chai";
import { PluncAppContext } from "../services/contextBinder";
import {
  getChildObjectExp,
  getParentObjAsObject,
} from "../services/expResolver";
import { MODEL_ELEMENT_ATTR } from "../services/pluncAttribute";
import { HTML5Date, HTML5Time } from "../types";

/**
 * The HTML5 <input type="date"> element typically returns
 * the date value as a string in the YYYY-MM-DD format.
 * This behavior is part of the HTML5 specification,
 * and most modern browsers adhere to this standard.
 * @param date - supposedly date in YYYY-MM-DD format
 */
function assertDateFormat(date: string): asserts date is HTML5Date {
  const message =
    `models assigned to Date input elements ` +
    `must follow standard HTML5 format YYYY-MM-DD`;
  const structure = date.split("-");
  const year = structure[0] ?? null;
  if (year === null || year.length < 4) {
    throw new Error(message);
  }
  const month = structure[1] ?? null;
  if (month === null || parseInt(month) > 12) {
    throw new Error(month);
  }
  const day = structure[2] ?? null;
  if (day === null || parseInt(day) > 31) {
    throw new Error(day);
  }
}

/**
 * For the HTML5 <input type="time"> element, the standard format
 * for the value returned is HH:MM, where HH is the hour in
 * 24-hour format (00-23) and MM is the minutes (00-59).
 * This format is specified by the HTML5 standard
 * and is supported by most modern browsers.
 * @param time - supposedly date in HH:MM format
 */
function assertTimeFormat(time: string): asserts time is HTML5Time {
  const message =
    `models assigned to Time input elements ` +
    `must follow standard HTML5 format HH:MM`;
  const structure = time.split(":");
  const hours = structure[0] ?? null;
  if (hours === null || hours.length < 2 || parseInt(hours) > 23) {
    throw new Error(message);
  }
  const minutes = structure[1] ?? null;
  if (minutes === null || minutes.length < 2 || parseInt(minutes) > 59) {
    throw new Error(message);
  }
}

const assignModelValue = (
  dataCtx: Readonly<{ [key: string]: unknown }>,
  expression: string,
  value: number | string | boolean | { [key: string]: any } | (() => unknown),
) => {
  const parentObj = getParentObjAsObject(dataCtx, expression);
  const childObjExpression = getChildObjectExp(expression);
  if (undefined !== parentObj) parentObj[childObjExpression] = value;
};

function setModelState(element: Element, state: boolean) {
  typeof state == "boolean" && state
    ? element.setAttribute("checked", "")
    : element.removeAttribute("checked");
}

function getCurrentDate(): HTML5Date {
  const date = new Date(Date.now());
  const nmonth = date.getMonth() + 1;
  const month = nmonth < 10 ? `0${nmonth}` : nmonth;
  const result = `${date.getFullYear()}-${month}-${date.getDate()}`;
  assertDateFormat(result);
  return result;
}

function getCurrentTime(): HTML5Time {
  const input = new Date(Date.now());
  const hours =
    input.getHours() < 10 ? `0${input.getHours()}` : input.getHours();
  const minutes =
    input.getMinutes() < 10 ? `0${input.getMinutes()}` : input.getMinutes();
  const result = hours + ":" + minutes;
  assertTimeFormat(result);
  return result;
}

function castAnyValueToString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function handleRadioAndCheckboxModel(
  maybeRadioOrCheckboxElement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  const elementType = maybeRadioOrCheckboxElement.type.toLowerCase();
  if (elementType !== "radio" && elementType !== "checkbox") {
    return;
  }
  const radioOrCheckboxElement = maybeRadioOrCheckboxElement;
  if (expressionValue === undefined) {
    // If the evaluation result is undefined, that means that the
    // value is not yet set. In this case, we'll set it to false.
    assignModelValue(dataCtx, expression, false);
    setModelState(radioOrCheckboxElement, false);
  } else if (typeof expressionValue === "boolean") {
    setModelState(radioOrCheckboxElement, expressionValue);
  } else {
    console.warn(
      `Model directive assigned to ` +
        `checkbox/radio input elements ` +
        `must be of boolean type.`,
    );
  }
}

export function handleTextInputButNotTextareaModel(
  maybeInputElement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  const elementType = maybeInputElement.type.toLowerCase();
  if (
    elementType === "text" ||
    elementType === "email" ||
    elementType === "password" ||
    elementType === "search" ||
    elementType === "url" ||
    elementType === "tel"
  ) {
    const inputElement = maybeInputElement;
    if (expressionValue === undefined) {
      // If the evaluation result is undefined, that means that the
      // value is not yet set in the scope. In this case, we'll
      // initialize it with the existing value of the input element.
      assignModelValue(dataCtx, expression, inputElement.value);
    } else {
      inputElement.value = castAnyValueToString(expressionValue);
    }
  }
}

export function handleNumberInputModel(
  maybeInputNumberElement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  const elementType = maybeInputNumberElement.type.toLowerCase();
  if (elementType === "number") {
    const inputElement = maybeInputNumberElement;
    if (expressionValue === undefined) {
      // If the evaluation result is undefined, that means that the
      // value is not yet set in the scope. In this case, we'll
      // initialize it with 0.
      assignModelValue(dataCtx, expression, 0);
      inputElement.value = "0";
    } else {
      inputElement.value = castAnyValueToString(expressionValue);
    }
  }
}

type ModelHandlerExecutor = (
  targetELement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) => void;
export function composeModelHandlerExecutor(
  targetELement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  return function executeHandler(handler: ModelHandlerExecutor) {
    handler(targetELement, dataCtx, expression, expressionValue);
  };
}

export function handleDateInputModel(
  maybeDateInputElement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  const elementType = maybeDateInputElement.type.toLowerCase();
  if (elementType === "date") {
    const dateInputElement = maybeDateInputElement;
    if (expressionValue === undefined) {
      // If the evaluation result is undefined, we set it to current date
      const currentDate = getCurrentDate();
      assignModelValue(dataCtx, expression, currentDate);
      dateInputElement.value = currentDate;
    } else {
      const stringifiedValue = castAnyValueToString(expressionValue);
      assertDateFormat(stringifiedValue);
      dateInputElement.value = stringifiedValue;
    }
  }
}

export function handleTimeInputModel(
  maybeTimeInputElement: HTMLInputElement,
  dataCtx: { [key: string]: any },
  expression: string,
  expressionValue: unknown,
) {
  const elementType = maybeTimeInputElement.type.toLowerCase();
  if (elementType === "time") {
    const timeInputElement = maybeTimeInputElement;
    if (expressionValue === undefined) {
      // If the evaluation result is undefined, we set it to current time
      const currentTime = getCurrentTime();
      assignModelValue(dataCtx, expression, currentTime);
      timeInputElement.value = currentTime;
    } else {
      const stringifiedValue = castAnyValueToString(expressionValue);
      assertTimeFormat(stringifiedValue);
      timeInputElement.value = stringifiedValue;
    }
  }
}

export function composeModelDirectiveProcessor(appCtx: PluncAppContext) {
  return function processModelDirective(
    elementCtx: HTMLElement,
    dataCtx: { [key: string]: unknown },
  ) {
    const elementsToProcess = appCtx.__querySelectAllByPluncAttribute(
      elementCtx,
      MODEL_ELEMENT_ATTR,
    );
    elementsToProcess.forEach((element) => {
      const modelExpression = appCtx.__pluncAttributeValueGetter(
        element,
        MODEL_ELEMENT_ATTR,
      );
      if (modelExpression === null || modelExpression.trim() === "") {
        return;
      }
      let evaluationResult: unknown = appCtx.__resolveExpression(
        dataCtx,
        modelExpression,
      );

      if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        if (element instanceof HTMLInputElement) {
          const execute = composeModelHandlerExecutor(
            element,
            dataCtx,
            modelExpression,
            evaluationResult,
          );
          // Radio buttons and checkboxes
          execute(handleRadioAndCheckboxModel);
          execute(handleTextInputButNotTextareaModel);
          execute(handleNumberInputModel);
          execute(handleDateInputModel);
          execute(handleTimeInputModel);
        }

        if (element instanceof HTMLSelectElement) {
          evaluationResult === undefined
            ? assignModelValue(dataCtx, modelExpression, element.value)
            : (element.value = castAnyValueToString(evaluationResult));
        }

        // Set up event listener to update model on user input
        // This way, the model stays in sync with the UI element
        element.addEventListener("change", (event) => {
          const target = event.target;
          if (target instanceof HTMLInputElement) {
            const targetType = target.type.toLowerCase();
            if (targetType === "radio" || targetType === "checkbox") {
              const isChecked = target.checked;
              assignModelValue(dataCtx, modelExpression, isChecked);
              return;
            }
            assignModelValue(dataCtx, modelExpression, target.value);
          }
          if (target instanceof HTMLSelectElement) {
            assignModelValue(dataCtx, modelExpression, target.value);
          }
        });
      } else if (
        element.tagName === "TEXTAREA" &&
        element instanceof HTMLTextAreaElement
      ) {
        evaluationResult === undefined
          ? assignModelValue(dataCtx, modelExpression, element.value)
          : (element.value = castAnyValueToString(evaluationResult));

        // Set up event listener to update model on user input
        // This way, the model stays in sync with the UI element
        element.addEventListener("change", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLTextAreaElement)) return;
          const value = target.value;
          assignModelValue(dataCtx, modelExpression, value);
        });
      }
    });
  };
}
