export class TrieNode {
  children = new Map<string, TrieNode>();
  end = false;
}

export class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
    }
    node.end = true;
  }

  has(word: string): boolean {
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      const next = node.children.get(ch);
      if (!next) return false;
      node = next;
    }
    return node.end;
  }

  hasPrefix(prefix: string): boolean {
    let node = this.root;
    for (const ch of prefix.toLowerCase()) {
      const next = node.children.get(ch);
      if (!next) return false;
      node = next;
    }
    return true;
  }
}

export function buildTrie(words: string[]): Trie {
  const t = new Trie();
  for (const w of words) t.insert(w);
  return t;
}
