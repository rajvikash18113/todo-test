'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_STORAGE_KEY = 'todo-status-overrides'
const STATUS_OPTIONS = ['not_started', 'pending', 'completed']
const FILTER_OPTIONS = ['all', ...STATUS_OPTIONS]

const STATUS_META = {
    completed: {
        label: 'Completed',
        shortLabel: 'Completed',
        text: 'text-emerald-300',
        chip: 'border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300 hover:border-emerald-400/25',
        ring: 'border-emerald-400/30 bg-emerald-400/[0.12] text-emerald-200 shadow-[0_0_0_1px_rgba(52,211,153,0.08)]',
        row: 'hover:border-emerald-400/15 hover:bg-emerald-400/[0.03]',
    },
    pending: {
        label: 'Pending',
        shortLabel: 'Pending',
        text: 'text-indigo-300',
        chip: 'border border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300 hover:border-indigo-400/25',
        ring: 'border-indigo-300/80 bg-transparent text-indigo-200 shadow-[0_0_0_1px_rgba(129,140,248,0.08)]',
        row: 'hover:border-indigo-400/15 hover:bg-indigo-400/[0.03]',
    },
    not_started: {
        label: 'Not Started',
        shortLabel: 'Not Started',
        text: 'text-orange-300',
        chip: 'border border-orange-400/12 bg-orange-400/[0.06] text-orange-300 hover:border-orange-400/20',
        ring: 'border-white/20 bg-transparent text-slate-500 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]',
        row: 'hover:border-white/10 hover:bg-white/[0.025]',
    },
}

function MenuIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        path d = "M5 7h14"
        strokeWidth = "1.8"
        strokeLinecap = "round" / >
        <
        path d = "M9 12h10"
        strokeWidth = "1.8"
        strokeLinecap = "round" / >
        <
        path d = "M13 17h6"
        strokeWidth = "1.8"
        strokeLinecap = "round" / >
        <
        /svg>
    )
}

function SettingsIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        path d = "M12 8.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"
        strokeWidth = "1.7" /
        >
        <
        path d = "M19 15.1a1 1 0 0 0 .2 1.1l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9v.2a1.8 1.8 0 1 1-3.6 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4.4a1.8 1.8 0 1 1 0-3.6h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9v-.2a1.8 1.8 0 1 1 3.6 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.8 1.8 0 1 1 0 3.6h-.2a1 1 0 0 0-.9.6Z"
        strokeWidth = "1.4"
        strokeLinecap = "round"
        strokeLinejoin = "round" /
        >
        <
        /svg>
    )
}

function PlusIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        circle cx = "12"
        cy = "12"
        r = "8"
        strokeWidth = "1.8" / >
        <
        path d = "M12 8.5v7"
        strokeWidth = "1.8"
        strokeLinecap = "round" / >
        <
        path d = "M8.5 12h7"
        strokeWidth = "1.8"
        strokeLinecap = "round" / >
        <
        /svg>
    )
}

function CalendarIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        rect x = "5.2"
        y = "6.7"
        width = "13.6"
        height = "11.8"
        rx = "2"
        strokeWidth = "1.6" / >
        <
        path d = "M8 5v3M16 5v3M5.5 10.2h13"
        strokeWidth = "1.6"
        strokeLinecap = "round" /
        >
        <
        /svg>
    )
}

function ClockIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        circle cx = "12"
        cy = "12"
        r = "7"
        strokeWidth = "1.6" / >
        <
        path d = "M12 8.7v4.1l2.5 1.4"
        strokeWidth = "1.6"
        strokeLinecap = "round"
        strokeLinejoin = "round" /
        >
        <
        /svg>
    )
}

function CodeIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        path d = "m9 8-4 4 4 4M15 8l4 4-4 4"
        strokeWidth = "1.6"
        strokeLinecap = "round"
        strokeLinejoin = "round" /
        >
        <
        /svg>
    )
}

function TrashIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        path d = "M4.8 7.5h14.4M9.7 4.8h4.6M8.8 10.2v6.1M15.2 10.2v6.1M7.3 7.5l.7 10a1.8 1.8 0 0 0 1.8 1.6h4.4a1.8 1.8 0 0 0 1.8-1.6l.7-10"
        strokeWidth = "1.6"
        strokeLinecap = "round"
        strokeLinejoin = "round" /
        >
        <
        /svg>
    )
}

function SparkIcon(props) {
    return ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor" {...props } >
        <
        path d = "m12 3 1.8 4.9L19 9.7l-4.2 2.5L13 17l-1.8-4.8L7 9.7l5.2-1.8L12 3Z"
        strokeWidth = "1.6"
        strokeLinecap = "round"
        strokeLinejoin = "round" /
        >
        <
        /svg>
    )
}

function readStatusOverrides() {
    if (typeof window === 'undefined') {
        return {}
    }

    try {
        return JSON.parse(window.localStorage.getItem(STATUS_STORAGE_KEY) ? ? '{}')
    } catch {
        return {}
    }
}

function writeStatusOverrides(overrides) {
    if (typeof window === 'undefined') {
        return
    }

    window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(overrides))
}

function getStoredIncompleteStatus(id, overrides = {}) {
    return overrides[id] === 'pending' ? 'pending' : 'not_started'
}

function getTodoStatus(todo, overrides = {}) {
    if (todo.is_complete) {
        return 'completed'
    }

    return getStoredIncompleteStatus(todo.id, overrides)
}

function getGreeting() {
    const hour = new Date().getHours()

    if (hour < 12) {
        return 'Good Morning Vikash.'
    }

    if (hour < 18) {
        return 'Good Afternoon.'
    }

    return 'Good Evening.'
}

function getTaskContext(todo) {
    const title = todo.title.toLowerCase()

    if (title.includes('review') || title.includes('plan')) {
        return { icon: CalendarIcon, label: 'Today' }
    }

    if (title.includes('presentation') || title.includes('call')) {
        return { icon: ClockIcon, label: '2:00 PM' }
    }

    return { icon: CodeIcon, label: '' }
}

function getWeeklyActivity(todos) {
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    const counts = Array.from({ length: 7 }, () => 0)

    todos.forEach(todo => {
        if (!todo.created_at) {
            return
        }

        const created = new Date(todo.created_at)
        const day = created.getDay()
        const mondayIndex = (day + 6) % 7
        counts[mondayIndex] += 1
    })

    const fallback = [2, 4, 3, 5, 6, 3, 4]
    const resolved = counts.some(Boolean) ? counts : fallback
    const max = Math.max(...resolved, 1)

    return resolved.map((count, index) => ({
        label: dayLabels[index],
        count,
        height: `${36 + (count / max) * 64}px`,
    }))
}

export default function Home() {
    const [todos, setTodos] = useState([])
    const [title, setTitle] = useState('')
    const [filter, setFilter] = useState('all')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [activeTodoId, setActiveTodoId] = useState(null)

    const fetchTodos = useCallback(async() => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setErrorMessage(error.message)
            setIsLoading(false)
            return
        }

        const overrides = readStatusOverrides()
        const nextTodos = (data || []).map(todo => ({
            ...todo,
            status: getTodoStatus(todo, overrides),
        }))

        setTodos(nextTodos)
        setErrorMessage('')
        setIsLoading(false)
    }, [])

    useEffect(() => {
        // Initial client-side data load from Supabase.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTodos()
    }, [fetchTodos])

    async function addTodo(event) {
        event ? .preventDefault()

        const nextTitle = title.trim()
        if (!nextTitle) {
            return
        }

        setIsCreating(true)
        setErrorMessage('')

        const { data, error } = await supabase
            .from('todos')
            .insert({ title: nextTitle, is_complete: false })
            .select('id')
            .single()

        if (error) {
            setErrorMessage(error.message)
            setIsCreating(false)
            return
        }

        const overrides = readStatusOverrides()
        overrides[data.id] = 'not_started'
        writeStatusOverrides(overrides)

        setTitle('')
        await fetchTodos()
        setIsCreating(false)
    }

    async function updateTodoStatus(todo, nextStatus) {
        setActiveTodoId(todo.id)
        setErrorMessage('')

        const previousOverrides = readStatusOverrides()
        const nextOverrides = {...previousOverrides }

        if (nextStatus === 'completed') {
            if (!nextOverrides[todo.id] && todo.status !== 'completed') {
                nextOverrides[todo.id] = todo.status
            }
        } else {
            nextOverrides[todo.id] = nextStatus
        }

        writeStatusOverrides(nextOverrides)

        const { error } = await supabase
            .from('todos')
            .update({ is_complete: nextStatus === 'completed' })
            .eq('id', todo.id)

        if (error) {
            writeStatusOverrides(previousOverrides)
            setErrorMessage(error.message)
            setActiveTodoId(null)
            return
        }

        await fetchTodos()
        setActiveTodoId(null)
    }

    async function toggleCompletion(todo) {
        const overrides = readStatusOverrides()
        const nextStatus =
            todo.status === 'completed' ?
            getStoredIncompleteStatus(todo.id, overrides) :
            'completed'

        await updateTodoStatus(todo, nextStatus)
    }

    async function toggleIncompleteState(todo) {
        const nextStatus = todo.status === 'pending' ? 'not_started' : 'pending'
        await updateTodoStatus(todo, nextStatus)
    }

    async function deleteTodo(id) {
        setActiveTodoId(id)
        setErrorMessage('')

        const { error } = await supabase.from('todos').delete().eq('id', id)

        if (error) {
            setErrorMessage(error.message)
            setActiveTodoId(null)
            return
        }

        const overrides = readStatusOverrides()
        delete overrides[id]
        writeStatusOverrides(overrides)

        await fetchTodos()
        setActiveTodoId(null)
    }

    const summary = todos.reduce(
        (accumulator, todo) => {
            accumulator[todo.status] += 1
            return accumulator
        }, { completed: 0, pending: 0, not_started: 0 }
    )

    const pendingToday = summary.pending + summary.not_started
    const filteredTodos =
        filter === 'all' ? todos : todos.filter(todo => todo.status === filter)
    const weeklyActivity = getWeeklyActivity(todos)

    return ( <
        main className = "min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_24%),linear-gradient(180deg,#091120_0%,#0b1326_52%,#0a1120_100%)] text-slate-100" >
        <
        div className = "mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8" >


        <
        div className = "mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,360px)]" >
        <
        section >
        <
        div className = "rounded-[20px] border border-white/5 bg-white/[0.015] p-5 sm:p-7" >
        <
        div className = "max-w-3xl" >
        <
        h1 className = "text-4xl font-extrabold tracking-tighter text-slate-50 sm:text-5xl lg:text-6xl" > { getGreeting() } <
        /h1> <
        p className = "mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg" >
        Your focus defines your reality. { pendingToday }
        tasks pending today. <
        /p> < /
        div >

        <
        form className = "mt-8 flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/85 px-4 py-3"
        onSubmit = { addTodo } >
        <
        button type = "submit"
        className = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-400/[0.12] text-indigo-200 transition hover:bg-indigo-400/[0.18] disabled:cursor-not-allowed disabled:opacity-60"
        disabled = {!title.trim() || isCreating }
        aria - label = "Add task" >
        <
        PlusIcon className = "h-5 w-5" / >
        <
        /button> <
        input className = "h-11 flex-1 bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
        value = { title }
        onChange = { event => setTitle(event.target.value) }
        placeholder = "Add a new task..." /
        >
        <
        span className = "hidden rounded-full border border-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 sm:inline-flex" > { isCreating ? 'Saving' : 'Quick Add' } <
        /span> < /
        form >

        {
            errorMessage ? ( <
                div className = "mt-4 rounded-2xl border border-rose-400/15 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" > { errorMessage } <
                /div>
            ) : null
        }

        <
        div className = "mt-7 flex flex-wrap gap-2.5" > {
            FILTER_OPTIONS.map(option => {
                const isActive = filter === option
                const label =
                    option === 'all' ? 'All' : STATUS_META[option].label

                return ( <
                    button key = { option }
                    type = "button"
                    className = { `rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : 'border border-white/5 bg-white/[0.03] text-slate-300 hover:border-indigo-400/15 hover:bg-indigo-400/[0.06]'
                      }` }
                    onClick = {
                        () => setFilter(option)
                    } > { label } <
                    /button>
                )
            })
        } <
        /div> < /
        div >

        <
        div className = "mt-6 rounded-[20px] border border-white/5 bg-slate-900/72" > {
            isLoading ? ( <
                div className = "px-5 py-8 text-sm text-slate-400 sm:px-6" >
                Loading tasks... <
                /div>
            ) : null
        }

        {
            !isLoading && filteredTodos.length === 0 ? ( <
                div className = "px-5 py-10 text-center sm:px-6" >
                <
                p className = "text-lg font-semibold text-slate-100" >
                No tasks in this view. <
                /p> <
                p className = "mt-2 text-sm text-slate-500" >
                Add a task above or
                switch filters to explore the full list. <
                /p> < /
                div >
            ) : null
        }

        {
            !isLoading
                ?
                filteredTodos.map((todo, index) => {
                    const meta = STATUS_META[todo.status]
                    const context = getTaskContext(todo)
                    const ContextIcon = context.icon
                    const isBusy = activeTodoId === todo.id

                    return ( <
                        article key = { todo.id }
                        className = { `group flex flex-col gap-4 border border-transparent px-5 py-5 transition duration-200 sm:flex-row sm:items-start sm:justify-between sm:px-6 ${meta.row} ${
                          index !== filteredTodos.length - 1
                            ? 'border-b border-white/5'
                            : ''
                        } ${todo.status === 'completed' ? 'opacity-75' : ''}` } >
                        <
                        div className = "flex min-w-0 items-start gap-4" >
                        <
                        button type = "button"
                        className = { `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 ${meta.ring}` }
                        onClick = {
                            () => toggleCompletion(todo)
                        }
                        disabled = { isBusy }
                        aria - label = { `Toggle completion for ${todo.title}` } > {
                            todo.status === 'completed' ? ( <
                                span className = "text-xs font-bold" > ✓ < /span>
                            ) : todo.status === 'pending' ? ( <
                                span className = "h-3 w-3 rounded-full border-2 border-indigo-300" / >
                            ) : null
                        } <
                        /button>

                        <
                        div className = "min-w-0" >
                        <
                        h2 className = { `truncate text-lg font-semibold tracking-tight ${
                                todo.status === 'completed'
                                  ? 'text-slate-500 line-through'
                                  : 'text-slate-100'
                              }` } > { todo.title } <
                        /h2>

                        <
                        div className = "mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500" >
                        <
                        span className = "inline-flex items-center gap-1.5" >
                        <
                        ContextIcon className = "h-3.5 w-3.5" / > { context.label } <
                        /span> <
                        span className = "text-slate-700" > • < /span> <
                        button type = "button"
                        className = { `rounded-full px-0.5 transition ${meta.text} ${
                                  todo.status === 'completed'
                                    ? 'cursor-default'
                                    : 'hover:opacity-80'
                                }` }
                        onClick = {
                            () => {
                                if (todo.status !== 'completed') {
                                    toggleIncompleteState(todo)
                                }
                            }
                        }
                        disabled = { isBusy } > { meta.shortLabel } <
                        /button> < /
                        div > <
                        /div> < /
                        div >

                        <
                        div className = "flex items-center gap-2 pl-12 sm:pl-0" > {
                            todo.status !== 'completed' ? ( <
                                button type = "button"
                                className = { `rounded-full px-3 py-1.5 text-xs font-semibold transition ${meta.chip} disabled:cursor-not-allowed disabled:opacity-60` }
                                onClick = {
                                    () => toggleIncompleteState(todo)
                                }
                                disabled = { isBusy } >
                                Switch State <
                                /button>
                            ) : ( <
                                span className = "rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500" >
                                Archived <
                                /span>
                            )
                        } <
                        button type = "button"
                        className = "flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick = {
                            () => deleteTodo(todo.id)
                        }
                        disabled = { isBusy }
                        aria - label = { `Delete ${todo.title}` } >
                        <
                        TrashIcon className = "h-4 w-4" / >
                        <
                        /button> < /
                        div > <
                        /article>
                    )
                }) :
                null
        } <
        /div> < /
        section >

        <
        aside className = "space-y-6" >
        <
        section className = "rounded-[20px] border border-white/5 bg-slate-900/74 p-5 backdrop-blur-xl sm:p-6" >
        <
        div className = "flex gap-4" >
        <
        div className = "w-1 rounded-full bg-gradient-to-b from-indigo-400 via-violet-300 to-transparent" / >
        <
        div >
        <
        p className = "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500" >
        Executive Summary <
        /p> <
        blockquote className = "mt-3 text-lg font-semibold leading-8 text-slate-100" >
        Clarity is a force multiplier.Finish the important work before the noisy work. <
        /blockquote> <
        p className = "mt-4 text-sm leading-6 text-slate-400" > { summary.completed }
        completed, { summary.pending } in motion,
        and { summary.not_started }
        waiting
        for intent. <
        /p> < /
        div > <
        /div> < /
        section >

        <
        section className = "rounded-[20px] border border-white/5 bg-slate-900/74 p-5 backdrop-blur-xl sm:p-6" >
        <
        div className = "flex items-start justify-between" >
        <
        div >
        <
        p className = "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500" >
        Weekly Progress <
        /p> <
        h3 className = "mt-2 text-xl font-bold tracking-tight text-slate-100" >
        Activity Flow <
        /h3> < /
        div > <
        SparkIcon className = "h-5 w-5 text-indigo-300" / >
        <
        /div>

        <
        div className = "mt-6 flex items-end gap-3" > {
            weeklyActivity.map(day => ( <
                div key = { day.label }
                className = "flex flex-1 flex-col items-center gap-2" >
                <
                div className = "flex h-28 w-full items-end rounded-2xl border border-white/5 bg-white/[0.025] p-1.5" >
                <
                div className = "w-full rounded-xl bg-gradient-to-t from-indigo-500 to-indigo-300"
                style = {
                    { height: day.height }
                }
                /> < /
                div > <
                span className = "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500" > { day.label } <
                /span> < /
                div >
            ))
        } <
        /div> < /
        section > <
        /aside> < /
        div > <
        /div> < /
        main >
    )
}