# SnapAI v2

## How to install

You will need the NodeJS runtime installed on your machine. You can download it from [here](https://nodejs.org/).

```bash
npm install
```

## How to run

```bash
npm run build
npx next start
```

or

```bash
npm run dev
```

![example-gif](./docs/example.gif)

# SnapAI v2

Version 2 of SnapAI, with the repository available at: [https://github.com/bps90/snapai](https://github.com/bps90/snapai)

SnapAI v2 is a network and distributed systems simulator designed for rapid and extensible experimentation. The project combines the simulation of network algorithms and protocols, following Software-Defined Systems (SDS) principles to maximize flexibility, programmability, and observability.

The platform enables the modeling of complex scenarios involving heterogeneous nodes, mobility, dynamic connectivity, message exchange, and timed events, while maintaining a low learning curve and a modular architecture. Unlike traditional simulators, SnapAI was designed from the ground up to work directly with graphs, enabling advanced analyses through Graphology.

SnapAI v2 extends the original proposal by strengthening:

a more intuitive and interactive interface,

expanded configuration and customization capabilities,

instrumentation of simulation metrics and internal states, and

a clear separation between node behavior, environmental models, and execution mechanisms.

The architecture is organized into well-defined components — Nodes, Messages, Models, Timers, Simulator, and Graphical Interface — allowing new behaviors, algorithms, or AI models to be incorporated without excessive coupling. The simulator supports both synchronous, round-based executions and asynchronous executions based on discrete events.

This makes SnapAI v2 suitable for research in complex networks, adaptive systems, IoT, mobile networks, tactical scenarios, and heterogeneous experimental environments.

SnapAI v2 is open-source, extensible, and aimed at both academic research and real-system prototyping, serving as a direct bridge between simulation, network analysis, and applied artificial intelligence.
