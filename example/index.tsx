import React, { ChangeEvent, useContext, useEffect } from "react"
import { createSubscription, useSubscription } from "../src/index"
import { render } from "react-dom"

const counterSubscription = createSubscription({ count: 0, foo: 10 })

const useCounter = () => {
	let { state, setState } = useSubscription(counterSubscription)
	const increment = () => setState({ count: state.count + 1 })
	const decrement = () => setState({ count: state.count + 1 })
	return { count: state.count, increment, decrement }
}

function CounterDisplay() {
	let { count, increment, decrement } = useCounter()
	return (
		<div>
			<button onClick={decrement}>-</button>
			<span>{count}</span>
			<button onClick={increment}>+</button>
		</div>
	)
}
function FooDisplay() {
	// Only update when foo change
	let { state, setState } = useSubscription(counterSubscription, ["foo"])

	console.log("Only update when foo change", state)
	return (
		<div>
			<button onClick={() => setState({ foo: state.foo - 1 })}>-</button>
			<span>{state.foo}</span>
			<button onClick={() => setState({ foo: state.foo + 1 })}>+</button>
		</div>
	)
}

const useTextValue = () => {
	const textSubscription = useContext(TextContext)
	let { state, setState } = useSubscription(textSubscription)
	const onChange = (e: ChangeEvent<HTMLInputElement>) =>
		setState(e.target.value)
	return { value: state, onChange }
}

function Text() {
	let { value, onChange } = useTextValue()
	return (
		<div>
			<input value={value} onChange={onChange} />
		</div>
	)
}

const TextContext = React.createContext<any>(null)

function TextComponent() {
	const textSubscription = createSubscription("The text will sync together")
	return (
		<TextContext.Provider value={textSubscription}>
			<Text />
			<Text />
		</TextContext.Provider>
	)
}

const fakeData = [
	{
		name: "Minh",
		email: "phanminh65@gmail.com",
	},
	{
		name: "Tester 1",
		email: "tester1@gmail.com",
	},
]

const mounterSubscription = createSubscription({ display: false, data: [] })

function DelayFetch() {
	const { setState, state } = useSubscription(mounterSubscription)
	useEffect(() => {
		console.log(
			"fetching... it will stop update if component is unmount but the state will still be changed",
		)
		setTimeout(() => {
			setState({ data: fakeData }, (newState) => {
				console.log("fetch data done...", newState)
			})
		}, 5000)
	}, [state.display])

	return (
		<div>
			{state.data.map((d: any) => {
				return (
					<div key={d.name}>
						<strong>{d.name}</strong>
						<span>{d.email}</span>
					</div>
				)
			})}
		</div>
	)
}

function MountAndUnmount() {
	const { state, setState } = useSubscription(mounterSubscription)

	// If you unmount when data is fetching
	return (
		<div>
			<button onClick={() => setState({ display: !state.display })}>
				{state.display ? "Unmount" : "Mount"}
			</button>
			{state.display && <DelayFetch />}
		</div>
	)
}

function App() {
	return (
		<>
			<CounterDisplay />
			<FooDisplay />
			<TextComponent />
			<MountAndUnmount />
		</>
	)
}

render(<App />, document.getElementById("root"))
