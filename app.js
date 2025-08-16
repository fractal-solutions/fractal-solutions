const { useState, useEffect, useRef } = React;

// Terminal typing effect hook
const useTypingEffect = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    let i = 0;
    setDisplayText('');
    setIsComplete(false);
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Matrix rain effect component
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'FRACTALQFLOW0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    className: 'fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0'
  });
};

// ASCII Art Logo Component
const FractalLogo = () => {
  const logo = `
███████╗██████╗  █████╗  ██████╗████████╗ █████╗ ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██║     
█████╗  ██████╔╝███████║██║        ██║   ███████║██║     
██╔══╝  ██╔══██╗██╔══██║██║        ██║   ██╔══██║██║     
██║     ██║  ██║██║  ██║╚██████╗   ██║   ██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝`;

  return React.createElement('pre', {
    className: 'text-cyan-400 text-[10px] md:text-sm lg:text-base font-bold glitch-text'
  }, logo);
};

// Terminal Window Component
const TerminalWindow = ({ title, children, className = '' }) => {
  return React.createElement('div', {
    className: `bg-black border border-cyan-500 rounded-lg shadow-2xl ${className} terminal-glow`
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-cyan-500'
    }, [
      React.createElement('div', {
        key: 'buttons',
        className: 'flex space-x-2'
      }, [
        React.createElement('div', { key: 'red', className: 'w-3 h-3 bg-red-500 rounded-full' }),
        React.createElement('div', { key: 'yellow', className: 'w-3 h-3 bg-yellow-500 rounded-full' }),
        React.createElement('div', { key: 'green', className: 'w-3 h-3 bg-green-500 rounded-full' })
      ]),
      React.createElement('span', {
        key: 'title',
        className: 'text-cyan-400 text-sm font-bold'
      }, title),
      React.createElement('div', { key: 'spacer', className: 'w-16' })
    ]),
    React.createElement('div', {
      key: 'content',
      className: 'p-6'
    }, children)
  ]);
};

// Interactive Console Component
const InteractiveConsole = () => {
  const [commands, setCommands] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const consoleEndRef = useRef(null);

  const systemCommands = {
    'help': 'Available commands: services, contact, stack, qflow, qflow-studio, iot, consulting, status, clear',
    'services': 'FRACTAL SOLUTIONS SERVICES:\n> Workflow Automation\n> IoT Solutions\n> Software Consultancy\n> QFlow Framework\n> QFlow Studio',
    'qflow': 'QFlow v2.1.7 - Advanced Workflow Automation Framework\nStatus: ACTIVE | Processes: 1,247 | Uptime: 99.97%',
    'qflow-studio': 'QFlow Studio - Visual Workflow Builder\nInterface: WEB-BASED | Nodes: 150+ | Integrations: 500+',
    'iot': 'IoT Solutions Hub\nConnected Devices: 27 | Data Points: 156/hr | Latency: <500ms',
    'consulting': 'Software Consultancy Services\nProjects Completed: 13 | Client Satisfaction: 98.7% | Avg. Delivery: -12% under schedule',
    'status': 'SYSTEM STATUS: OPERATIONAL\nCPU: 23% | Memory: 67% | Network: 1.2Gb/s | Temp: 42°C',
    'clear': 'CLEAR_TERMINAL',
    'stack': `My Preferred Stack:

- Languages:  JavaScript, Golang
- Runtimes:   Bun, Node.js
- Frontend:   React, Solid.js, Three.js
- Styling:    Tailwind CSS, Shadcn/UI, Material UI
- Database:   SQLite
- Workflow:   Qflow, n8n
- Deployment: Nginx, PM2
- Embedded:   LVGL

I can build on any stack. Principles are transferable, and I spend a lot of time tinkering and building.`,
    'contact': `Contact Information:

- Email: fractal_solutions@protonmail.com
- Phone: +254701564710
- X (Twitter): @frctl_solutions`
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const response = systemCommands[trimmedCmd] || `Command '${cmd}' not found. Type 'help' for available commands.`;
    
    if (response === 'CLEAR_TERMINAL') {
      setCommands([]);
    } else {
      setCommands(prev => [...prev, { input: cmd, output: response }]);
    }
    setCurrentInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      executeCommand(currentInput);
    }
  };

  useEffect(() => {
    // Auto-execute startup sequence
    const startupCommands = ['status', 'services'];
    let delay = 1000;
    
    startupCommands.forEach((cmd, index) => {
      setTimeout(() => executeCommand(cmd), delay + (index * 2000));
    });
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollTop = consoleEndRef.current.scrollHeight;
    }
  }, [commands]);

  return React.createElement('div', {
    ref: consoleEndRef,
    className: 'text-sm space-y-2 max-h-80 overflow-y-auto no-scrollbar'
  }, [
    ...commands.map((cmd, index) => 
      React.createElement('div', { key: index }, [
        React.createElement('div', {
          key: 'input',
          className: 'text-green-400 break-all'
        }, `fractal@system:~$ ${cmd.input}`),
        React.createElement('pre', {
          key: 'output',
          className: 'text-cyan-300 whitespace-pre-wrap mb-2'
        }, cmd.output)
      ])
    ),
    React.createElement('div', {
      key: 'current',
      className: 'flex items-center flex-wrap text-green-400'
    }, [
      React.createElement('span', { key: 'prompt' }, 'fractal@system:~$ '),
      React.createElement('input', {
        key: 'input',
        type: 'text',
        value: currentInput,
        onChange: (e) => setCurrentInput(e.target.value),
        onKeyPress: handleKeyPress,
        className: 'bg-transparent border-none outline-none flex-1 text-cyan-400',
        placeholder: 'Type a command...',
        autoFocus: true
      }),
      React.createElement('span', {
        key: 'cursor',
        className: 'animate-pulse'
      }, '█')
    ])
  ]);
};

// Service Card Component
const ServiceCard = ({ title, description, command, icon, githubUrl, libraries }) => {
  const [isHovered, setIsHovered] = useState(false);

  return React.createElement('div', {
    className: `bg-gray-900 border border-cyan-700 rounded-lg p-6 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 cursor-pointer ${isHovered ? 'scale-105' : ''}`,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }, [
    React.createElement('div', {
      key: 'header',
      className: 'flex items-center space-x-3 mb-4'
    }, [
      React.createElement('span', {
        key: 'icon',
        className: 'text-2xl'
      }, icon),
      React.createElement('h3', {
        key: 'title',
        className: 'text-cyan-400 font-bold text-lg'
      }, title)
    ]),
    React.createElement('p', {
      key: 'description',
      className: 'text-gray-300 mb-4'
    }, description),
    React.createElement('code', {
      key: 'command',
      className: 'text-green-400 text-sm bg-black px-2 py-1 rounded'
    }, `$ ${command}`),
    githubUrl && React.createElement('a', {
      key: 'github-link',
      href: githubUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      className: 'text-cyan-400 hover:text-white transition-colors mt-4 inline-block'
    }, 'View on GitHub →'),
    libraries && React.createElement('div', { key: 'libs', className: 'mt-4' }, [
      React.createElement('h4', { key: 'libs-header', className: 'text-cyan-400 font-bold' }, 'Libraries:'),
      ...libraries.map(lib => React.createElement('div', { key: lib.name, className: 'mt-2' }, [
        React.createElement('a', {
          key: 'lib-link',
          href: lib.githubUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-gray-300 hover:text-white'
        }, lib.name),
        React.createElement('code', {
          key: 'lib-npm',
          className: 'text-green-400 text-sm bg-black px-2 py-1 rounded ml-2'
        }, lib.npmCommand)
      ]))
    ])
  ]);
};

// System Status Component
const SystemStatus = () => {
  const [stats, setStats] = useState({
    cpu: 23,
    memory: 67,
    network: 1.2,
  });
  const [uptime, setUptime] = useState('00:00:00');
  const [startTime] = useState(new Date());

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      const now = new Date();
      const diff = now - startTime;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setUptime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    const getNetworkSpeed = async () => {
      try {
        const startTime = new Date().getTime();
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52&q=' + new Date().getTime()); 
        const blob = await response.blob();
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const size = blob.size;
        const speedBps = (size * 8) / duration;
        const speedKbps = speedBps / 1024;
        return speedKbps;
      } catch (error) {
        console.error("Could not get network speed:", error);
        return Math.max(500, Math.min(2000, (Math.random() * 1500) + 500));
      }
    };


    const statsInterval = setInterval(async () => {
      const networkSpeed = await getNetworkSpeed();
      setStats(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: window.performance && window.performance.memory ?
          (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit) * 100 :
          Math.max(50, Math.min(85, prev.memory + (Math.random() - 0.5) * 5)),
        network: networkSpeed
      }));
    }, 2000);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(statsInterval);
    };
  }, [startTime]);

  return React.createElement('div', {
    className: 'grid grid-cols-2 md:grid-cols-4 gap-4'
  }, [
    React.createElement('div', {
      key: 'cpu',
      className: 'bg-gray-900 border border-cyan-700 rounded p-3'
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'text-cyan-400 text-sm font-bold'
      }, 'CPU'),
      React.createElement('div', {
        key: 'value',
        className: 'text-white text-xl'
      }, `${stats.cpu.toFixed(0)}%`),
      React.createElement('div', {
        key: 'bar',
        className: 'w-full bg-gray-700 rounded-full h-2 mt-2'
      }, React.createElement('div', {
        className: `bg-cyan-400 h-2 rounded-full transition-all duration-500`,
        style: { width: `${stats.cpu}%` }
      }))
    ]),
    React.createElement('div', {
      key: 'memory',
      className: 'bg-gray-900 border border-cyan-700 rounded p-3'
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'text-cyan-400 text-sm font-bold'
      }, 'MEMORY'),
      React.createElement('div', {
        key: 'value',
        className: 'text-white text-xl'
      }, `${stats.memory.toFixed(0)}%`),
      React.createElement('div', {
        key: 'bar',
        className: 'w-full bg-gray-700 rounded-full h-2 mt-2'
      }, React.createElement('div', {
        className: `bg-green-400 h-2 rounded-full transition-all duration-500`,
        style: { width: `${stats.memory}%` }
      }))
    ]),
    React.createElement('div', {
      key: 'network',
      className: 'bg-gray-900 border border-cyan-700 rounded p-3'
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'text-cyan-400 text-sm font-bold'
      }, 'NETWORK'),
      React.createElement('div', {
        key: 'value',
        className: 'text-white text-xl'
      }, `${stats.network.toFixed(0)}Kb/s`)
    ]),
    React.createElement('div', {
      key: 'uptime',
      className: 'bg-gray-900 border border-cyan-700 rounded p-3'
    }, [
      React.createElement('div', {
        key: 'label',
        className: 'text-cyan-400 text-sm font-bold'
      }, 'UPTIME'),
      React.createElement('div', {
        key: 'value',
        className: 'text-white text-xl'
      }, uptime)
    ])
  ]);
};

// Main App Component
const App = () => {
  const { displayText: heroText } = useTypingEffect('ADVANCED SYSTEMS ENGINEERING', 80);
  const { displayText: subText } = useTypingEffect('Fractal Solutions: Specializing in Workflow Automation, DevOps, IoT, and Trading Systems.', 60);

  const services = [
    {
      title: 'QFlow Framework',
      description: 'Advanced workflow automation engine with real-time processing capabilities',
      command: 'npm install @fractal-solutions/qflow',
      icon: '⚡',
      githubUrl: 'https://github.com/fractal-solutions/qflow'
    },
    {
      title: 'QFlow Studio',
      description: 'Visual workflow builder with drag-and-drop interface and 50+ integrations (Work in Progress)',
      command: 'qflow-studio --launch TBA',
      icon: '🎨',
      githubUrl: 'https://github.com/fractal-solutions/qflow-studio'
    },
    {
      title: 'Machine Learning & AI',
      description: 'Integrate cutting-edge AI and machine learning models into your systems.',
      command: 'ai --integrate',
      icon: '🧠',
      libraries: [
        {
          name: 'fractal-RL',
          githubUrl: 'https://github.com/fractal-solutions/fractal-RL',
          npmCommand: 'npm install fractal-rl'
        },
        {
          name: 'xgboost-js',
          githubUrl: 'https://github.com/fractal-solutions/xgboost-js',
          npmCommand: 'npm install @fractal-solutions/xgboost-js'
        }
      ]
    },
    {
      title: 'Trading Systems',
      description: 'Automated trading algorithms and advanced data visualization, including charting and analytics.',
      command: 'trading --demo',
      icon: '💹'
    },
    {
      title: 'DevOps Solutions',
      description: 'Streamline your development and operations with our expert DevOps services.',
      command: 'devops --consult',
      icon: '🚀'
    },
    {
      title: 'IoT Solutions',
      description: 'Enterprise IoT management with real-time monitoring and analytics',
      command: 'iot --dashboard',
      icon: '🌐'
    },
    {
      title: 'Software Consultancy',
      description: 'Expert consulting services for enterprise software architecture',
      command: 'consulting --portfolio',
      icon: '💼'
    }
  ];

  return React.createElement('div', {
    className: 'min-h-screen relative'
  }, [
    React.createElement(MatrixRain, { key: 'matrix' }),
    
    React.createElement('div', {
      key: 'content',
      className: 'relative z-10'
    }, [
      // Header
      React.createElement('header', {
        key: 'header',
        className: 'p-6 border-b border-cyan-700'
      }, [
        React.createElement('div', {
          key: 'container',
          className: 'max-w-7xl mx-auto'
        }, [
          React.createElement(FractalLogo, { key: 'logo' }),
          React.createElement('div', {
            key: 'nav',
            className: 'flex items-center justify-between mt-6'
          }, [
            React.createElement('div', {
              key: 'status',
              className: 'text-green-400 flex items-center space-x-2'
            }, [
              React.createElement('span', { key: 'dot', className: 'w-3 h-3 bg-green-400 rounded-full animate-pulse' }),
              React.createElement('span', { key: 'text' }, 'SYSTEM ONLINE')
            ]),
            React.createElement('nav', {
              key: 'menu',
              className: 'hidden md:flex space-x-6'
            }, [
              React.createElement('a', {
                key: 'services',
                href: '#services',
                className: 'text-cyan-400 hover:text-white transition-colors'
              }, '> SERVICES'),
              React.createElement('a', {
                key: 'console',
                href: '#console',
                className: 'text-cyan-400 hover:text-white transition-colors'
              }, '> CONSOLE'),
              React.createElement('a', {
                key: 'contact',
                href: '#contact',
                className: 'text-cyan-400 hover:text-white transition-colors'
              }, '> CONTACT')
            ])
          ])
        ])
      ]),

      // Hero Section
      React.createElement('section', {
        key: 'hero',
        className: 'py-20 px-6'
      }, React.createElement('div', {
        className: 'max-w-7xl mx-auto text-center'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-4xl md:text-6xl font-bold mb-6 glitch-text'
        }, heroText),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-xl md:text-2xl text-gray-300 mb-8'
        }, subText),
        React.createElement(SystemStatus, { key: 'status' })
      ])),

      // Services Section
      React.createElement('section', {
        key: 'services',
        id: 'services',
        className: 'py-20 px-6'
      }, React.createElement('div', {
        className: 'max-w-7xl mx-auto'
      }, [
        React.createElement(TerminalWindow, {
          key: 'services-terminal',
          title: 'SERVICES.EXE',
          className: 'mb-12'
        }, React.createElement('div', {
          className: 'grid md:grid-cols-2 gap-6'
        }, services.map((service, index) =>
          React.createElement(ServiceCard, {
            key: index,
            ...service
          })
        )))
      ])),

      // Interactive Console Section
      React.createElement('section', {
        key: 'console',
        id: 'console',
        className: 'py-20 px-6'
      }, React.createElement('div', {
        className: 'max-w-4xl mx-auto'
      }, React.createElement(TerminalWindow, {
        title: 'FRACTAL_TERMINAL.SH',
        className: 'mb-12'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-2xl font-bold text-cyan-400 mb-6'
        }, 'Interactive System Console'),
        React.createElement('p', {
          key: 'description',
          className: 'text-gray-300 mb-6'
        }, 'Access system information and explore our services through the command interface. Type "help" for available commands.'),
        React.createElement(InteractiveConsole, { key: 'console' })
      ]))),

      // Contact Section
      React.createElement('section', {
        key: 'contact',
        id: 'contact',
        className: 'py-20 px-6'
      }, React.createElement('div', {
        className: 'max-w-4xl mx-auto'
      }, React.createElement(TerminalWindow, {
        title: 'CONTACT.TXT',
        className: 'mb-12'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-2xl font-bold text-cyan-400 mb-6'
        }, 'Contact Information'),
        React.createElement('div', { key: 'contact-info', className: 'text-sm' }, [
          React.createElement('p', {
            key: 'email',
            className: 'text-gray-300'
          }, 'Email: ', React.createElement('a', {
            href: 'mailto:fractal_solutions@protonmail.com',
            className: 'text-cyan-400 hover:text-white'
          }, 'fractal_solutions@protonmail.com')),
          React.createElement('p', {
            key: 'phone',
            className: 'text-gray-300'
          }, 'Phone: ', React.createElement('a', {
            href: 'tel:+254701564710',
            className: 'text-cyan-400 hover:text-white'
          }, '+254701564710')),
          React.createElement('p', {
            key: 'twitter',
            className: 'text-gray-300'
          }, 'X (Twitter): ', React.createElement('a', {
            href: 'https://twitter.com/frctl_solutions',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-cyan-400 hover:text-white'
          }, '@frctl_solutions'))
        ])
      ]))),

      // Footer
      React.createElement('footer', {
        key: 'footer',
        className: 'border-t border-cyan-700 py-8 px-6'
      }, React.createElement('div', {
        className: 'max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center'
      }, [
        React.createElement('div', {
          key: 'copyright',
          className: 'text-gray-400 text-sm'
        }, '© 2025 Fractal Solutions. All systems operational.'),
        React.createElement('div', {
          key: 'social-links',
          className: 'flex space-x-4 mt-4 md:mt-0'
        },[
          React.createElement('a', {
            key: 'fractal-github',
            href: 'https://github.com/fractal-solutions/',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'text-gray-400 hover:text-cyan-400 transition-colors'
          }, 'Fractal on GitHub')
        ]),
        React.createElement('div', {
          key: 'berrry',
          className: 'text-gray-600 text-xs mt-4 md:mt-0'
        }, React.createElement('a', {
          href: 'https://berrry.app',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'hover:text-cyan-400 transition-colors'
        }, 'Built with 🍓 Berrry'))
      ]))
    ])
  ]);
};

// Render the app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
