# 📚 How to Add Reference Books

## Structure Created

I've added a **Reference Books** section beside the Learning Materials Library on the ECE Resources page.

### Features:

- ✅ **Table Layout** with 4 columns:

  1. **#** - Sequential numbering (auto-generated)
  2. **Book Name** - Title of the book
  3. **Author** - Author name
  4. **Actions** - View and Download buttons

- ✅ **Styling**: Different color scheme (Primary blue) to distinguish from Learning Materials (Accent cyan)
- ✅ **Responsive**: Side-by-side on large screens, stacked on mobile
- ✅ **Scrollable**: Max height with custom scrollbar
- ✅ **Empty State**: Shows placeholder when no books are added

---

## How to Add Books

### Step 1: Place Your PDF Files

Put your book PDF files in the assets folder, for example:

```
src/assets/ECE/Reference Books/
```

### Step 2: Import the PDF Files

At the top of `ECEResources.tsx`, add imports (around line 38):

```typescript
// Import Reference Books
import BookTitle1 from "@/assets/ECE/Reference Books/book1.pdf";
import BookTitle2 from "@/assets/ECE/Reference Books/book2.pdf";
// Add more imports...
```

### Step 3: Update the Reference Books Array

Find the `referenceBooks` state (around line 208) and replace the empty array:

```typescript
const [referenceBooks, setReferenceBooks] = useState<ReferenceBook[]>([
  {
    id: "book1",
    bookName: "Digital Electronics: Principles and Applications",
    author: "Roger L. Tokheim",
    path: BookTitle1,
    size: 5234567, // File size in bytes (approximate)
  },
  {
    id: "book2",
    bookName: "Microelectronic Circuits",
    author: "Adel S. Sedra, Kenneth C. Smith",
    path: BookTitle2,
    size: 8976543,
  },
  {
    id: "book3",
    bookName: "Communication Systems",
    author: "Simon Haykin",
    path: BookTitle3,
    size: 6543210,
  },
  // Add more books here...
]);
```

---

## Complete Example

### Full Code Example:

```typescript
// Imports (at top of file)
import ElectronicsBook from "@/assets/ECE/Reference Books/Electronics_Fundamentals.pdf";
import CircuitsBook from "@/assets/ECE/Reference Books/Circuit_Analysis.pdf";
import SignalsBook from "@/assets/ECE/Reference Books/Signals_Systems.pdf";

// In the component (around line 208)
const [referenceBooks, setReferenceBooks] = useState<ReferenceBook[]>([
  {
    id: "ref_book_1",
    bookName: "Electronics Fundamentals: Circuits, Devices & Applications",
    author: "Thomas L. Floyd",
    path: ElectronicsBook,
    size: 12456789,
  },
  {
    id: "ref_book_2",
    bookName: "Circuit Analysis: Theory and Practice",
    author: "Allan H. Robbins",
    path: CircuitsBook,
    size: 9876543,
  },
  {
    id: "ref_book_3",
    bookName: "Signals and Systems",
    author: "Alan V. Oppenheim",
    path: SignalsBook,
    size: 8765432,
  },
]);
```

---

## File Size Estimation

If you don't know the exact file size, you can:

1. Check the file properties on your computer
2. Use approximate values (1 MB = 1,048,576 bytes)
3. Use these estimates:
   - Small book (100-200 pages): ~2-5 MB = 2,000,000 - 5,000,000 bytes
   - Medium book (200-400 pages): ~5-10 MB = 5,000,000 - 10,000,000 bytes
   - Large book (400+ pages): ~10-20 MB = 10,000,000 - 20,000,000 bytes

---

## Interface Structure

```typescript
interface ReferenceBook {
  id: string; // Unique identifier (e.g., "book1", "ref_book_1")
  bookName: string; // Full title of the book
  author: string; // Author name(s)
  path: string; // Imported PDF path
  size: number; // File size in bytes
}
```

---

## Visual Appearance

### Reference Books Box:

- **Header**: Purple/Blue gradient (Primary colors)
- **Border**: Primary blue border
- **Layout**: Table with numbered rows
- **Buttons**:
  - "View" button (Blue) - Opens in new tab
  - "Download" button (Primary) - Downloads the file

### Differences from Learning Materials:

| Feature      | Learning Materials    | Reference Books               |
| ------------ | --------------------- | ----------------------------- |
| Color Scheme | Cyan/Accent           | Blue/Primary                  |
| Layout       | Folder/File hierarchy | Table format                  |
| Columns      | File info only        | #, Book Name, Author, Actions |
| Icon         | FileText              | FileText/Book                 |

---

## Tips

1. **Consistent Naming**: Use clear, descriptive book names
2. **Author Format**: Use standard format (First Last) or (Last, First)
3. **ID Convention**: Use lowercase with underscores (e.g., "ref_book_1")
4. **Path Organization**: Keep all reference books in one folder
5. **File Sizes**: Include them for better user experience (shows download size)

---

## Current State

✅ Structure is ready  
✅ Empty state is showing  
⏳ Waiting for you to add book PDFs  
⏳ Waiting for you to add book data

Once you provide the PDF files, I'll help you add them to the array!

---

## Need Help?

Just provide:

1. PDF file names
2. Book titles
3. Author names

And I'll generate the complete code for you! 📚✨
