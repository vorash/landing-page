<!-- Copied from vorash/vora-mail docs/privacy-policy.md at 8004a99 (origin/main) by scripts/sync-mail-privacy.sh. Edit it there, not here. -->
# Vora Mail — Privacy Policy

Effective date: 15 October 2026.

## 1. Who this is about

Vora Mail (called "Vora" in the rest of this policy) is a free, open-source, non-commercial desktop
email client for Linux, published by Iulian Safta, a private individual living in France ("we", "the publisher"). Its source code (<https://github.com/vorash/vora-mail>) is open and
licensed under either the MIT licence (<https://opensource.org/license/mit>) or the Apache License
2.0 (<https://www.apache.org/licenses/LICENSE-2.0>). It is
not sold, and it has no advertising and no paid plan. This policy covers
the Vora application on your computer: the window (`vora`), its background service (`vorad`) and
its command line tool (`vora-cli`). It does not cover your mail provider, Google, Anthropic or
TypeSafe: each has its own policy, linked below.

Contact for privacy questions: contact@vora.sh. Who is responsible for what, and your rights, are in §12; the website is in §13.

## 2. The short version

- **Vora has no server.** Your mail goes between your mail provider and your computer. We run no
  service that receives, stores or relays your mail, your address book or your settings, and we
  have no copy of any of it.
- **Your mail is stored on your computer**, encrypted: the database and the attachments you
  downloaded are encrypted at rest, with a key that lives in your system's keyring (§4). Your
  sign-in credentials are stored in the keyring too, never in the database or in a settings file.
- **No telemetry, no analytics, no crash reports, no advertising.** Vora sends nothing to us.
- **Two optional features send some of your mail to a third-party AI service.** Both are off until
  you turn them on, and both use an API key that you provide (§6). **Mail from a Gmail account
  signed in through Vora's built-in Google sign-in is never sent to either**: AI triage uses its
  local rules only for such an account, and "Use the message I'm replying to" is not offered for its
  messages. IMAP/SMTP accounts (including Gmail with an app password) and Gmail accounts signed in
  with your own Google client can use both:
  - the **writing assistant** sends the text you are writing to **Anthropic** when you ask it to,
    and, only if you tick a box for that one request, the message you are replying to. A separate
    switch, **Check as you type**, off by default, sends your draft after each pause in typing;
  - **Smart Inbox AI triage** sends each new inbox conversation's sender, subject and the start of
    its latest message to **TypeSafe**.
- We use information from Google accounts only as §7 says, and we meet Google's Limited Use
  requirements.

## 3. What Vora Mail reads from your accounts

### 3.1 Google accounts

You sign in with Google in your own web browser; Vora never sees your Google password. Vora asks
Google for these permissions (OAuth scopes):

| Scope | Why |
|---|---|
| `openid`, `email`, `profile` | To know which Google account you signed in with, and show its address and name. |
| `https://www.googleapis.com/auth/gmail.modify` | To read your mail, and to change it when you ask: archive, label, star, mark read or unread, move, save drafts and send. Google classes this as a *restricted* scope. |

Vora signs in with its own built-in Google client by default. Someone who prefers can sign in with
their own Google client instead (a `[google]` section in `config.toml`); Vora records, for each
Gmail account, which of the two issued its sign-in. §6 depends on that.

With that permission Vora calls the Gmail API to read your profile, your labels, your conversations
and their messages (the full message, including its text, its HTML and the list of its
attachments), and the history of changes since the last sync. Attachment contents are fetched only
when you preview, open or save an attachment. Vora changes your mailbox only to carry out
something you did: a label change, a read mark, a draft, a sent message.

### 3.2 Other mail accounts (IMAP and SMTP)

If you add an account that is not a Google account, Vora signs in to your provider's IMAP and SMTP
servers with the address and password you give. It reads folders and messages the same way and
stores them the same way as above.

Before an account is added, Vora can look up your provider's server settings. It then asks
`autoconfig.<your address's domain>` and `autoconfig.thunderbird.net` over HTTPS. Only the domain
(the part after the `@`) is part of that, never the part before it. The form says so before it
asks, and you can skip the lookup.

## 4. Where your data is kept

Everything below is on your computer, under your user account.

| What | Where | Protection |
|---|---|---|
| Mail: conversations, messages, bodies, attachment lists, labels, drafts, a search index, messages waiting to be sent (with their attachments) | `~/.local/share/vora/vora.db` | **Encrypted** with SQLCipher (AES-256). File mode 0600, folder 0700 |
| Attachments you downloaded | `~/.local/share/vora/attachments/<account>/…` | **Each file encrypted** (XChaCha20-Poly1305) with a key derived from the database key. Files 0600, folders 0700. File names and sizes are visible on the disk; contents are not |
| Settings, including whether you turned the AI features on and when | `~/.config/vora/config.toml` | Your user's file permissions. No mail in it |
| Sign-in credentials (Google refresh token, IMAP password), the API keys for the AI features, and the database key | Your system keyring (Secret Service), items with `application = vora` | Whatever your keyring provides |

**The key.** When Vora first starts it makes a random 256-bit key on your computer and stores it only
in your keyring. Nothing is derived from a password, and the key is never in a log, a setting or on
a command line. Whoever can use your keyring while you are logged in can read your mail: the
encryption protects a stolen or lost disk, a backup, a copy of the file, and any program that cannot
reach your keyring. It does not protect memory, swap or hibernation images.

**No keyring, no mail.** If there is no keyring, or it is locked and will not unlock, Vora shows
your mail as locked and explains how to fix it. It never falls back to storing mail unencrypted. If
the keyring works but has lost the key (after a keyring reset, say), the mail on disk cannot be
read: Vora says so and offers **Start over**, which moves the unreadable file aside, makes a new key
and syncs your accounts again from the provider. Drafts that were never sent, and messages still
waiting to be sent, exist only in that file and are lost.

**Opening an attachment in another application** needs a readable copy. Vora decrypts it into a
private temporary directory under `$XDG_RUNTIME_DIR/vora/open/` (memory-backed on most systems,
readable only by you) and removes every such copy when Vora starts and when it quits; it cannot know
when the other application is finished with a copy, so a copy stays while Vora runs. **The other
application may keep a copy of its own** (a recent-files list, a thumbnail, a backup file), which
Vora does not control. If `$XDG_RUNTIME_DIR` is not usable, Vora refuses to open and tells you to
save instead. **Saving an attachment** writes it unencrypted where you choose; that file is yours.

A database or attachment folder left by an earlier version of Vora, before encryption, is encrypted
once when you upgrade, and the old plaintext file is overwritten and removed. That overwrite is best
effort: on an SSD or a copy-on-write filesystem the old blocks can survive it.

The access token Google gives Vora is kept in memory only. At its normal log level Vora does not
write message text, tokens or API keys to its logs.

## 5. Who Vora Mail talks to

Vora connects to these, and to nothing else:

| Destination | When | What goes there |
|---|---|---|
| Google (`accounts.google.com`, `oauth2.googleapis.com`, `gmail.googleapis.com`) | Signing in, syncing, acting on mail, removing an account | The OAuth sign-in, your requests to Gmail, and the revocation of Vora's access when you remove an account |
| Your IMAP and SMTP servers | For an IMAP account | Your login and your mail |
| `autoconfig.<domain>`, `autoconfig.thunderbird.net` | When you add an IMAP account and do not skip the lookup | The domain of your address |
| Whatever a message links to | Only if you set remote images to "always", or tell Vora to load them for a message | An ordinary web request for each image, from your computer. The default is to ask, and to block them |
| `api.anthropic.com` | Only with the writing assistant turned on, when you ask it for help | §6.1 |
| `api.typesafe.ai` | Only with Smart Inbox AI triage turned on | §6.2 |

## 6. Optional third-party AI

Vora has two features that send some of your mail to an AI service. Neither is on by default: a
fresh install sends nothing to either. To turn one on you pick the provider in Settings, save your
own API key, and confirm a dialog that states what is sent, to whom and under which terms. We do
not provide the keys and we do not see the requests: they go from your computer straight to the
provider, under your own agreement with that provider.

A result from either feature is only a suggestion or a label. Nothing is sent, moved, archived or
deleted because of it.

**Which accounts.** For a Gmail account signed in through Vora's built-in Google client, Vora never
sends the account's mail to either provider: Smart Inbox AI triage classifies it with local rules
only, whatever the setting says, and the writing assistant's "Use the message I'm replying to" box
is not offered for its messages. Gmail accounts signed in with your own Google client, and
IMAP/SMTP accounts (including Gmail used with an app password), can use both features as described
below. The writing assistant on text you write yourself (§6.1) works for every account.
If Google's review decides that a draft synced from Gmail, or the recipients' names, count as
restricted Gmail data, the app and this policy will change together.

### 6.1 The writing assistant (Anthropic)

**What it is.** In the message composer, you can ask Claude to proofread, rewrite, shorten,
lengthen, change the tone of, translate, or write from notes. Every request is made by you, with
one click or shortcut, and is one request, except for the optional **Check as you type** switch
described below. Nothing runs on a message you only received.

**Where it runs.** In the Vora window on your computer, not in the background service and not on
any server of ours. The request goes over HTTPS to Anthropic's API (`api.anthropic.com`,
`POST /v1/messages`) with your API key.

**What is sent with a request.**

- The text you selected, or your draft when nothing is selected. The quoted older message, or the
  forwarded message, below your text is never part of it.
- For *write from notes* instead: the notes you typed in the assistant, and **not** the draft.
- The action you chose, the output language, the tone, and the form of address (informal or
  formal "you") if you set one.
- For *write from notes* only, also what you typed in the composer: the **display names** of the
  people in To, and the Subject. A recipient with no display name adds nothing, and a name that is
  an email address is left out.
- **Only if you tick "Use the message I'm replying to" for that request**, and only in a reply or
  a forward, and never for a message of a Gmail account signed in through Vora's built-in Google
  client (the box is not offered there): the display name of the sender of the message you are answering (never their
  address), its subject, and the text of its latest message, with the quoted earlier messages
  removed and cut to 4,000 characters. This applies to *write from notes* and to the rewrite
  actions. **Proofreading never sends it**, whatever the box says, because proofreading checks
  your own words and its request has no place for it.
- The first time you tick that box, Vora asks you to confirm, naming the sender and the subject
  that would be sent. Until you have confirmed, no received message is sent even if a setting says
  the box should start ticked.

Each of the three confirmations (turning the assistant on, ticking the reply box, and turning on
Check as you type) is for one version of its text. If a later version of Vora changes what is sent,
to whom, or the terms, that confirmation counts as not given: nothing of that kind is sent until
Vora has asked again.

**What is never sent.** Attachments, email addresses (yours, the sender's, and the recipients'),
Cc and Bcc, other messages of the conversation, other accounts, contacts, labels, and your API
key.

**Who receives it.** Anthropic, as your service provider under your agreement with it (§6.3).

**Check as you type (a separate switch, off by default).** Settings → Composing → Writing
assistant → Check as you type. If you turn it on, then in the composer, about two seconds after you
stop typing and without a click, Vora proofreads your draft. It sends what a click on Proofread
sends and nothing more: the draft's own lines, never the quoted message, never the message you are
replying to (whatever the reply box says), never attachments or email addresses. It makes at most 20
requests for a message, none for words it already checked, and typing again cancels a check still in
progress. It has its own confirmation, which says what is sent, when, to whom, what it costs and the
cap, and it works only while the assistant is turned on.

**Controls.** §8.

### 6.2 Smart Inbox AI triage (TypeSafe)

**What it is.** Vora can sort and rank your inbox with rules that run entirely on your computer.
If you choose, it also asks an AI classifier to label each new conversation (people, updates,
newsletters or promotions; whether it asks you to do something; how urgent; whether it looks like
phishing). The answers only rank and label conversations.

**Where it runs.** In Vora's background service on your computer, after each sync. The request goes
over HTTPS to TypeSafe (`api.typesafe.ai`, `POST /v1/systemone`) with your TypeSafe API key.

**What is sent, for each conversation it classifies.**

- The sender's **name and email address**.
- The subject.
- The text of the latest message in the inbox, with quoted earlier messages removed, cut to
  2,000 characters.

**Which mail.** Never mail of a Gmail account signed in through Vora's built-in Google client: it
is sorted by the local rules only, and results the model gave it earlier go back to the rules. For
the other accounts, only inbox conversations whose latest message arrived after you turned the
feature on. Conversations from a sender that you gave a rule, and conversations you sorted by hand, are not
sent. Older mail is sent only if you choose "Classify older mail" in Settings, which shows how
many conversations that is and asks you first.

**What is never sent.** Attachments, recipients, other messages, other accounts. Your corrections
are not sent.

**Who receives it.** TypeSafe, under your agreement with it (§6.4).

**Controls.** §8.

### 6.3 Anthropic's terms

Anthropic's own words, read on 2026-10-15. **These must be read again before this policy is
published and again at M10; do not publish them from this draft.**

- On training, Anthropic's privacy center ("Is my data used for model training?", dated
  August 18, 2026,
  <https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training>):
  "By default, we will not use your inputs or outputs from our commercial products (e.g. Claude for
  Work, Anthropic API, Claude Gov, etc.) to train our models." The same page says that if you
  report feedback or "otherwise choose to allow us to use your data", it may. Vora has no way to
  send Anthropic feedback.
- Anthropic's Commercial Terms of Service
  (<https://www.anthropic.com/legal/commercial-terms>): "Anthropic may not train models on Customer
  Content from Services."
- On retention, Anthropic's privacy center ("How long do you store my organization's data?", dated
  July 1, 2026,
  <https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data>):
  "For Anthropic API users, we automatically delete inputs and outputs on our backend within 30
  days of receipt or generation", except when you use a service with longer retention under your
  control, when you and Anthropic have agreed otherwise, "If we need to retain them for longer to
  enforce our Usage Policy (UP)", and "In compliance with the law". The same page says: "We retain
  inputs and outputs for up to 2 years and trust and safety classification scores for up to 7
  years if your chat is flagged by our automated trust and safety systems as violating our Usage
  Policy."
- Anthropic's API documentation ("API and data retention",
  <https://platform.claude.com/docs/en/manage-claude/api-and-data-retention>) is worded
  differently: "Conversation content (your prompts and Claude's outputs) is not retained by
  default; the exception is Covered Models, which require 30-day retention." It also says that
  "if a chat or session is flagged, Anthropic may retain inputs and outputs for up to 2 years."
  The two pages do not say the same thing. This policy relies on the longer one, 30 days.
- The three models Vora offers (Claude Opus 5.5, Sonnet 5.5 and Haiku 5.5) are not "Covered
  Models" (Claude Fable and Mythos), which require 30-day retention in all cases.
- For structured replies, Anthropic caches the shape of the JSON answer Vora asks for, "for up to
  24 hours since last use" (same API page). That shape is fixed by Vora and holds none of your
  text.

You can ask Anthropic for a zero-retention agreement for your own account; that is between you and
Anthropic.

### 6.4 TypeSafe's terms

TypeSafe's own words, read on 2026-10-15. **To be read again before publishing and at M10.**

- Privacy policy (<https://typesafe.ai/legal/privacy-policy>, dated Nov 19, 2025): "We will not
  train or fine tune any artificial intelligence or machine learning models on your prompts or
  other Input", and "(2) will not disclose any Input to a third party other than our service
  providers."
- On retention, the same policy: "We retain personal data about you for as long as reasonably
  necessary to provide you with the Services", and the data processing addendum
  (<https://typesafe.ai/legal/data-processing>, dated Apr 24, 2026) says personal data "will be
  retained for as long as necessary taking into account the purpose of the Processing". Neither
  page, as read on that date, gives a number of days. TypeSafe's own pages above are the terms
  that apply.

## 7. Google user data: Limited Use

Vora Mail's use and transfer of information received from Google APIs will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

The Limited Use requirements are at
<https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes>.
Google's additional policy for Gmail data, the
[Google Workspace user data and developer policy](https://developers.google.com/workspace/workspace-api-user-data-developer-policy),
applies as well.

In practice, for Gmail data (the content and metadata Vora receives through the Gmail API):

- **Use.** Vora uses it only to provide and improve the features you see in its window: reading,
  searching, sorting, replying to and sending mail. It is not used for advertising, for
  creditworthiness or lending decisions, or to build or train any machine learning or AI model.
  The only model-based features are the two in §6, and neither receives mail that Vora read through
  its built-in Google client.
- **Transfer.** We do not receive it, because Vora has no server. **Gmail data that Vora reads
  through its built-in Google client is not sent to the AI services at all** (§6): no triage
  excerpt, no reply context. The only other transfer of Gmail data to anyone else is to the AI
  services of §6, for an account signed in with your own Google client, and only to provide the
  feature you turned on, with your consent: your confirmation when you turned the feature on, for
  the reply context of the writing assistant a second confirmation and a tick for each request,
  and for Check as you type its own confirmation. The text you write yourself in the composer can
  go to Anthropic from any account when you ask for the writing assistant. Both providers state that they
  do not train their models on this data (§6.3 and §6.4). We do not sell it or give it to
  advertisers, data brokers or resellers.
- **People reading it.** No person at the publisher can read it, because it never reaches us.
  Anthropic and TypeSafe may have their own review for abuse; see their terms in §6.3 and §6.4.
- **Security.** Mail is transferred only over TLS. It is stored on your computer as §4 says.

This policy is the one Google's verification of Vora Mail will refer to. If we change how Vora uses Google user
data, we will tell you in the application and ask you again before we use it in the new way.

## 8. Your controls

**Turn an AI feature off.** Settings → Composing → Writing assistant, or Settings → Smart Inbox:
set the provider to **Off**. This needs no confirmation. The assistant makes no new request after
that (closing the composer cancels one in progress), and triage sends nothing from its next call.
Removing the API key from Settings also turns the feature off. If the provider rejects your key, Vora turns
the feature off and tells you. **Check as you type** has its own switch (Settings → Composing →
Writing assistant) and also stops when the assistant is turned off.

**Decide per request.** The "Use the message I'm replying to" box is per request. You can leave it
unticked, and Settings has a switch for whether it starts ticked. Proofreading never sends the
message in any case.

**Withdraw consent.** Turning a feature off stops all further transfers. Turning it on again asks
you to confirm again. What a provider already received is held under its own terms (§6.3, §6.4);
to have it deleted, ask the provider. Settings cannot yet forget the one-time confirmation of
"Use the message I'm replying to" once you have given it; turning the writing assistant off stops
all further requests.

**Remove an account.** Settings → Accounts → remove. Vora asks Google to revoke its access (if
that request fails, for example because you are offline, the account is still removed), deletes the
sign-in credential from your keyring, deletes the account's mail from the database, and deletes the
account's downloaded attachments. Deleted mail may remain, still encrypted, in unused space inside
the database file until it is reused; Vora does not currently compact the file. You can also remove Vora's access from
your Google Account at <https://myaccount.google.com/permissions>.

**Delete everything Vora stored.** Quit Vora, then delete `~/.local/share/vora/` (mail and
attachments) and `~/.config/vora/` (settings), and delete the keyring items with
`application = vora`, which include the database key (for example with your keyring's manager). Copies you made yourself when
saving an attachment, and copies another application kept (§4), are outside Vora's folders.

**Remote images.** Settings → Privacy: ask (default), never, or always.

## 9. Security

Mail is exchanged with providers only over TLS, with certificates checked. Message HTML is
sanitised and shown in a web view that runs no scripts and loads remote content only if you allow
it. Credentials and the database key are in the
system keyring. The mail database and the downloaded attachments are encrypted at rest and readable
only by you. Received mail given
to an AI service is wrapped as untrusted data, and the assistant has no tools: a result can at worst
be a bad suggestion that you see and reject. The full technical description is in the project's security document
(<https://github.com/vorash/vora-mail/blob/main/docs/security.md>).

## 10. Children

Vora Mail is not intended for anyone under 15.

## 11. Changes to this policy

Changes are announced on this page, with a new effective date. The dated history of this policy
is kept in the project's public source repository (<https://github.com/vorash/vora-mail>). If a
change affects what
the writing assistant sends to a third party, the application asks for your consent again before
the new behaviour starts. (Built for the writing assistant, its reply box and Check as you type; not
yet for Smart Inbox AI triage, whose confirmation does not carry a version.)

## 12. Who is responsible, your rights, contact

**Publisher.** Iulian Safta, a private individual living in France, who publishes Vora as a free,
open-source (MIT or Apache-2.0), non-commercial project. Contact: contact@vora.sh.

**What the publisher itself processes.** Vora has no server, and the publisher receives no mail,
address book, settings or usage data from the application. The publisher is the controller (under
the GDPR) only of the little it processes itself: the emails you send to contact@vora.sh, meaning
your address, your name if you give it, and what you write. It uses them to answer you. The legal
basis is its legitimate interest in answering messages sent to it (Article 6(1)(f) GDPR). They are
kept as long as needed to answer, and at most 2 years. The address contact@vora.sh is received by
Cloudflare (Cloudflare Email Routing) and forwarded to a Gmail mailbox (Google); both process the
emails on the publisher's behalf.

**What Vora sends from your computer to others.** The data that Vora sends to Google, to your mail
provider, to Anthropic or to TypeSafe goes from your computer, with your accounts and your keys, and
is governed by their policies (§6). Requests to Anthropic and TypeSafe are made by you, under your
own agreement with each and with your own key, not on the publisher's behalf. The publisher does not
receive that data and does not decide how those providers use it.

**Your rights.** Because the publisher is established in France, the GDPR applies. For the data in
the paragraphs above you have the rights of access, rectification, erasure, restriction of
processing, objection and data portability, and, where processing rests on your consent, the right
to withdraw it. Write to contact@vora.sh; the publisher answers within one month. You may also
complain to the French data protection authority, the CNIL (<https://www.cnil.fr>), or to the
authority of the country where you live.

**Transfers outside the EEA, and a data protection officer.** Requests to Anthropic and TypeSafe,
which may be outside the European Economic Area, are made directly between you and those providers.
Contact emails pass through Cloudflare and Google, which may process them outside the EEA under
their own safeguards. No data protection officer is required for this processing, and none has been
appointed.

**Governing law.** This policy is governed by French law. If you are a consumer, you keep the
protection of the mandatory law of the country where you live, and you may bring a claim before the
courts of that country.

## 13. This website (www.vora.sh)

The website where this policy is published is separate from the application. It is hosted by
Vercel (<https://vercel.com>), which processes request logs, such as the IP address and the user
agent, to serve and protect the site; see
[Vercel's privacy notice](https://vercel.com/legal/privacy-notice). The site sets no cookies, has no
analytics and loads nothing from third parties (its fonts are served from the site itself). The only
thing it stores is your choice of day or night theme, in your own browser (`localStorage`), and that
is never sent anywhere. The mailing-list form on the home page does not send what you type anywhere.

---

