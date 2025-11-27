// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for Next.js Request/Response
global.Request = class Request {
  constructor(input, init) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init?.method || 'GET';
    this.headers = new Map(Object.entries(init?.headers || {}));
    this._body = init?.body;
  }
  
  async json() {
    return JSON.parse(this._body || '{}');
  }
  
  text() {
    return Promise.resolve(this._body || '');
  }
}

global.Response = class Response {
  constructor(body, init) {
    this._body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Map(Object.entries(init?.headers || {}));
  }
  
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
  
  text() {
    return Promise.resolve(typeof this._body === 'string' ? this._body : JSON.stringify(this._body));
  }
  
  static json(data, init) {
    return new Response(JSON.stringify(data), init);
  }
}

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(() => Promise.resolve({ ok: true, error: null })),
  signOut: jest.fn(() => Promise.resolve()),
  SessionProvider: ({ children }) => children,
}))

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  default: jest.fn(),
}))

// Mock framer-motion - filter out motion-specific props
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: ({ children, whileHover, whileTap, animate, initial, transition, ...props }) => 
        React.createElement('div', props, children),
      button: ({ children, whileHover, whileTap, animate, initial, transition, ...props }) => 
        React.createElement('button', props, children),
      input: ({ whileFocus, animate, initial, transition, ...props }) => 
        React.createElement('input', props),
      textarea: ({ whileFocus, animate, initial, transition, ...props }) => 
        React.createElement('textarea', props),
      form: ({ children, animate, initial, transition, ...props }) => 
        React.createElement('form', props, children),
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
    }),
  };
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  redirect: jest.fn(),
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(url, init) {
      this.url = url;
      this.method = init?.method || 'GET';
      this._body = init?.body;
    }
    
    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }
  },
  NextResponse: {
    json: (data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      statusText: init?.statusText || 'OK',
    }),
  },
}))

// Mock Prisma Client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    lunchUpdate: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

