import { useReducer } from 'react';
import './App.css';
import DigitButton from './digit';
import OperationButton from './operation';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  state.eval = false
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        if (payload.digit == ".") {
          return {
            ...state,
            previousOperand: null,
            currentOperand: "0.",
            overwrite: false,
            eval: false
          }
        }
        return {
          ...state,
          previousOperand: null,
          currentOperand: payload.digit,
          overwrite: false,
          eval: false
        }
      }
      if (payload.digit == "0" && state.currentOperand == "0") {
        return state
      }
      if (payload.digit == "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: "0."
        }
      }
      if (payload.digit == "." && state.currentOperand.includes(".")) {
        return state
      }
      if (state.currentOperand != null && state.currentOperand.length == 7 && !state.currentOperand.includes(".")) {
        return state
      }
      if (state.currentOperand != null && state.currentOperand.length == 8 && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null || state.eval == false) {
        if (state.currentOperand == "UNDEF") {
          return state
        }
        if (state.currentOperand == "0.") {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: "0",
            currentOperand: null,
            overwrite: false,
            eval: false
          }
        }
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
          overwrite: false,
          eval: false
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          previousOperand: null,
          currentOperand: null,
          overwrite: false
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }
      return {
        ...state,
        previousOperand: `${state.previousOperand} ${state.operation} ${state.currentOperand}`,
        operation: null,
        currentOperand: evaluate(state),
        overwrite: true,
        eval: true
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(currentOperand)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "x":
      computation = prev * curr
      break
    case "÷":
      if (curr == 0) {
        return "UNDEF"
      }
      computation = prev / curr
      break
  }
  return computation.toString()
}

function format(operand) {
  if (operand == null) {
    return
  }
  const [integer, decimal] = operand.split('.')
  if (decimal == null) {
    return integer
  }
  if (decimal.length > 7) {
    if (decimal.charAt(8) >=5) {
      decimal = toString(parseInt(decimal.charAt(7)) + 1)
    }
  }
  return `${integer}.${decimal.substring(0, 7)}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previousOperand">{previousOperand} {operation}</div>
        <div className="currentOperand">{format(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button className="equal" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  )
}

export default App;