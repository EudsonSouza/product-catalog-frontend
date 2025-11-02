import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../search-bar'

describe('SearchBar', () => {
  describe('Main Flow - Search Functionality', () => {
    it('should render with search input and icon', () => {
      const onChange = vi.fn()
      render(<SearchBar value="" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /search/i })
      expect(input).toBeInTheDocument()
    })

    it('should display current search value', () => {
      const onChange = vi.fn()
      render(<SearchBar value="laptop" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /search/i })
      expect(input).toHaveValue('laptop')
    })

    it('should call onChange when user types', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /search/i })
      await user.type(input, 't')

      expect(onChange).toHaveBeenCalledWith('t')
    })

    it('should handle clearing search text', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<SearchBar value="test" onChange={onChange} />)

      const input = screen.getByRole('textbox', { name: /search/i })
      await user.clear(input)

      expect(onChange).toHaveBeenCalledWith('')
    })
  })

  describe('Customization', () => {
    it('should use custom placeholder when provided', () => {
      const onChange = vi.fn()
      render(<SearchBar value="" onChange={onChange} placeholder="Find products..." />)

      const input = screen.getByPlaceholderText('Find products...')
      expect(input).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const onChange = vi.fn()
      const { container } = render(
        <SearchBar value="" onChange={onChange} className="custom-class" />
      )

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})
